"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onOrderDeleted = exports.onBroadcastCreated = exports.onOfferUpdated = exports.onWalletTransactionCreated = exports.onOrderUpdated = exports.onOrderCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Dispatch high-priority FCM notifications that wake up devices even when the phone screen is off / locked.
 * Features store-and-forward (TTL: 24h) so if the phone is turned off, notifications deliver immediately upon turning on.
 */
async function sendNotificationToTokens(tokens, title, body, data = {}) {
    if (tokens.length === 0)
        return { sent: 0, failed: 0, removed: 0 };

    // Remove duplicates
    const uniqueTokensMap = new Map();
    tokens.forEach(t => uniqueTokensMap.set(t.fcmToken, t));
    const uniqueTokensList = Array.from(uniqueTokensMap.values());

    let sent = 0;
    let failed = 0;
    let removed = 0;
    const badge = "/icon-192.png";
    const icon = "/icon-192.png";

    const promises = uniqueTokensList.map(async (tokenData) => {
        const message = {
            token: tokenData.fcmToken,
            notification: {
                title,
                body,
            },
            data: {
                ...data,
                badge,
                icon,
                click_action: "/",
            },
            android: {
                priority: "high",
                ttl: 86400 * 1000,
                notification: {
                    title,
                    body,
                    sound: "default",
                    channelId: "harinos_alerts",
                    priority: "high",
                    defaultSound: true,
                    defaultVibrateTimings: true,
                    visibility: "public",
                    clickAction: "/",
                },
            },
            apns: {
                headers: {
                    "apns-priority": "10",
                    "apns-push-type": "alert",
                },
                payload: {
                    aps: {
                        alert: {
                            title,
                            body,
                        },
                        sound: "default",
                        badge: 1,
                        contentAvailable: true,
                    },
                },
            },
            webpush: {
                headers: {
                    Urgency: "high",
                    TTL: "86400",
                },
                notification: {
                    title,
                    body,
                    icon: "/icon-192.png",
                    badge: "/icon-192.png",
                    vibrate: [300, 150, 300, 150, 300],
                    requireInteraction: true,
                    tag: data.orderId ? `order-${data.orderId}` : `harinos-${Date.now()}`,
                },
            },
        };

        try {
            await messaging.send(message);
            sent++;
            await logNotificationStats(true);
        }
        catch (error) {
            failed++;
            await logNotificationStats(false);
            const errorMsg = error.message || "";
            const isUnregistered = error.code === "messaging/registration-token-not-registered" ||
                error.code === "messaging/invalid-registration-token" ||
                errorMsg.includes("unregistered") ||
                errorMsg.includes("invalid-registration-token");
            if (isUnregistered) {
                try {
                    await db.collection("notification_tokens").doc(tokenData.id).delete();
                    removed++;
                    await logTokenRemoval();
                    console.log(`[FCM Clean] Removed expired token: ${tokenData.id}`);
                }
                catch (dbErr) {
                    console.warn(`[FCM Clean] Failed to remove expired token: ${tokenData.id}`, dbErr);
                }
            }
            else {
                console.warn(`[FCM Failed] Token: ${tokenData.id}, Error:`, error);
            }
        }
    });

    await Promise.all(promises);
    return { sent, failed, removed };
}

async function logNotificationStats(success) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const statsRef = db.collection("notification_stats").doc(todayStr);
    try {
        await db.runTransaction(async (transaction) => {
            const snap = await transaction.get(statsRef);
            const data = snap.exists ? snap.data() || {} : {};
            const sentCount = data.sent || 0;
            const failedCount = data.failed || 0;
            transaction.set(statsRef, {
                sent: success ? sentCount + 1 : sentCount,
                failed: success ? failedCount : failedCount + 1,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        });
    }
    catch (err) {
        console.error("Failed to log notification stats:", err);
    }
}

async function logTokenRemoval() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const statsRef = db.collection("notification_stats").doc(todayStr);
    try {
        await statsRef.set({
            removedTokens: admin.firestore.FieldValue.increment(1)
        }, { merge: true });
    }
    catch (err) {
        console.error("Failed to log token removal stats:", err);
    }
}

const cleanPhone = (phone) => (phone || "").replace(/\D/g, "");

/**
 * 1. Order Created Trigger
 */
exports.onOrderCreated = (0, firestore_1.onDocumentCreated)("orders/{orderId}", async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const order = snap.data();
    const orderId = event.params.orderId;
    const cleanId = orderId.slice(-6).toUpperCase();

    // 1a. Notify Customer of Order Confirmation (Wakes device even if screen is off)
    const customerPhone = cleanPhone(order.customerPhone);
    const customerId = order.customerId;
    const targetUserIds = [customerId, customerPhone, order.customerPhone].filter(Boolean);

    if (targetUserIds.length > 0) {
        const custSnap = await db.collection("notification_tokens")
            .where("userId", "in", targetUserIds.slice(0, 10))
            .where("isActive", "==", true)
            .get();
        const customerTokens = custSnap.docs.map(d => d.data());
        await sendNotificationToTokens(
            customerTokens,
            `🍕 Order Confirmed! (#${cleanId})`,
            `We've received your order of Rs ${Math.round(order.total || 0)}! The Harino's kitchen is preparing it fresh.`,
            { orderId, eventType: "ORDER_CREATED" }
        );
    }

    // 1b. Notify Staff, Managers & Admins
    const staffTitle = "🍕 New Order Received";
    const staffBody = `Order #${cleanId} (${order.orderType || 'takeaway'}) - Rs ${Math.round(order.total || 0)} is waiting to be prepared.`;

    const tokensSnap = await db.collection("notification_tokens")
        .where("isActive", "==", true)
        .get();
    const allTokens = tokensSnap.docs.map(d => d.data());
    const staffTargets = allTokens.filter(token => {
        if (token.role === "admin")
            return true;
        if (token.role === "manager" || token.role === "staff") {
            if (order.outletId && token.outletId) {
                return token.outletId === order.outletId;
            }
            return true;
        }
        return false;
    });

    await sendNotificationToTokens(staffTargets, staffTitle, staffBody, {
        orderId,
        eventType: "NEW_ORDER",
        outletId: order.outletId || "",
        orderType: order.orderType || "takeaway"
    });
});

/**
 * 2. Order Updated (Status Changes: Preparing, Ready, Out for Delivery, Done, Cancelled)
 */
exports.onOrderUpdated = (0, firestore_1.onDocumentUpdated)("orders/{orderId}", async (event) => {
    var _a, _b;
    const beforeSnap = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before;
    const afterSnap = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after;
    if (!beforeSnap || !afterSnap)
        return;
    const before = beforeSnap.data();
    const after = afterSnap.data();
    const orderId = event.params.orderId;
    const cleanId = orderId.slice(-6).toUpperCase();
    const previousStatus = before.status || "new";
    const currentStatus = after.status || "new";
    if (previousStatus === currentStatus)
        return;

    // 2a. Notify Customer of Status Update
    const customerPhone = cleanPhone(after.customerPhone);
    const customerId = after.customerId;
    const targetUserIds = [customerId, customerPhone, after.customerPhone].filter(Boolean);

    if (targetUserIds.length > 0) {
        const custSnap = await db.collection("notification_tokens")
            .where("userId", "in", targetUserIds.slice(0, 10))
            .where("isActive", "==", true)
            .get();
        const customerTokens = custSnap.docs.map(d => d.data());
        let title = `Order Update (#${cleanId})`;
        let body = `Your order status changed to ${currentStatus}.`;
        if (currentStatus === "preparing") {
            title = `👨‍🍳 Preparing Your Fresh Food! (#${cleanId})`;
            body = "The kitchen is actively baking your pizza and preparing your order fresh right now!";
        }
        else if (currentStatus === "ready") {
            title = `✅ Hot & Ready! (#${cleanId})`;
            body = after.orderType === "delivery"
                ? "Your order is packaged, hot, and ready for dispatch!"
                : "Your order is steaming hot and ready at the counter! Please collect your meal.";
        }
        else if (currentStatus === "out_for_delivery") {
            title = `🚗 Out for Delivery! (#${cleanId})`;
            body = "Our delivery rider is on the way with your delicious hot Harino's food!";
        }
        else if (currentStatus === "done") {
            title = `🎉 Order Delivered! (#${cleanId})`;
            body = "Thank you for ordering with Harino's! Enjoy your meal.";
        }
        else if (currentStatus === "cancelled") {
            title = `❌ Order Cancelled (#${cleanId})`;
            body = `Your order was cancelled: ${after.cancellationReason || 'No reason specified'}. Applied wallet balance has been refunded.`;
        }
        await sendNotificationToTokens(customerTokens, title, body, {
            orderId,
            eventType: currentStatus.toUpperCase()
        });
    }

    // 2b. Notify Staff if Order was Cancelled
    if (currentStatus === "cancelled") {
        const title = "⚠️ Order Cancelled";
        const body = `Order #${cleanId} was cancelled. Reason: ${after.cancellationReason || 'N/A'}`;
        const tokensSnap = await db.collection("notification_tokens")
            .where("isActive", "==", true)
            .get();
        const allTokens = tokensSnap.docs.map(d => d.data());
        const staffTargets = allTokens.filter(token => {
            if (token.role === "admin")
                return true;
            if (token.role === "manager" || token.role === "staff") {
                if (after.outletId && token.outletId) {
                    return token.outletId === after.outletId;
                }
                return true;
            }
            return false;
        });
        await sendNotificationToTokens(staffTargets, title, body, {
            orderId,
            eventType: "ORDER_CANCELLED",
            outletId: after.outletId || "",
            reason: after.cancellationReason || ""
        });
    }
});

/**
 * 3. Wallet Updates Trigger
 */
exports.onWalletTransactionCreated = (0, firestore_1.onDocumentCreated)("wallet_transactions/{txId}", async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const tx = snap.data();
    const customerPhone = cleanPhone(tx.customerPhone);
    const customerId = tx.customerId;
    const targetUserIds = [customerId, customerPhone, tx.customerPhone].filter(Boolean);
    if (targetUserIds.length === 0)
        return;

    const custSnap = await db.collection("notification_tokens")
        .where("userId", "in", targetUserIds.slice(0, 10))
        .where("isActive", "==", true)
        .get();
    const customerTokens = custSnap.docs.map(d => d.data());
    if (customerTokens.length === 0)
        return;

    const amount = Math.round(Math.abs(tx.amount || 0));
    let title = "💰 Harino's Wallet Update";
    let body = `Your wallet balance has been updated by Rs ${amount}.`;
    if (tx.type === "credit") {
        title = "💰 Harino's Wallet Credited!";
        body = `Rs ${amount} has been added to your Harino's wallet! Balance is ready to use.`;
    }
    else if (tx.type === "debit") {
        title = "💳 Wallet Payment Applied";
        body = `Rs ${amount} was deducted from your wallet for your order.`;
    }
    else if (tx.type === "reward") {
        title = "🌟 Reward Coins Credited!";
        body = `+${amount} coins added to your Harino's reward balance!`;
    }

    await sendNotificationToTokens(customerTokens, title, body, {
        txId: event.params.txId,
        eventType: "WALLET_UPDATE",
        amount: String(amount)
    });
});

/**
 * 4. Offers Trigger
 */
exports.onOfferUpdated = (0, firestore_1.onDocumentUpdated)("offers/{offerId}", async (event) => {
    var _a;
    const afterSnap = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after;
    if (!afterSnap)
        return;
    const offer = afterSnap.data();
    if (!offer.enabled || !offer.notifyCustomers)
        return;

    const title = `🔥 Special Offer: ${offer.offerTitle || "Discount Alert!"}`;
    const body = offer.displayText || offer.description || "Check out our latest mouth-watering pizza deals at Harino's!";
    const custSnap = await db.collection("notification_tokens")
        .where("role", "==", "customer")
        .where("isActive", "==", true)
        .get();
    const customerTokens = custSnap.docs.map(d => d.data());

    await sendNotificationToTokens(customerTokens, title, body, {
        offerId: event.params.offerId,
        eventType: "NEW_OFFER"
    });
});

/**
 * 5. Broadcast Notifications Trigger
 */
exports.onBroadcastCreated = (0, firestore_1.onDocumentCreated)("broadcast_notifications/{broadcastId}", async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const broadcast = snap.data();
    const title = broadcast.title || "Harino's Pizza Update";
    const body = broadcast.body || broadcast.message || "You have a new update from Harino's!";
    const tokensSnap = await db.collection("notification_tokens")
        .where("isActive", "==", true)
        .get();
    const allTokens = tokensSnap.docs.map(d => d.data());

    await sendNotificationToTokens(allTokens, title, body, {
        broadcastId: event.params.broadcastId,
        eventType: "BROADCAST"
    });
});

/**
 * 6. Order Deleted Trigger
 */
exports.onOrderDeleted = (0, firestore_1.onDocumentDeleted)("orders/{orderId}", async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const order = snap.data();
    const orderId = event.params.orderId;
    const title = "🗑️ Order Record Deleted";
    const body = `Order #${orderId.slice(-6)} was deleted from database.`;
    const tokensSnap = await db.collection("notification_tokens")
        .where("role", "==", "admin")
        .where("isActive", "==", true)
        .get();
    const adminTokens = tokensSnap.docs.map(d => d.data());
    await sendNotificationToTokens(adminTokens, title, body, {
        orderId,
        eventType: "ORDER_DELETED",
        total: String(order.total || 0)
    });
});