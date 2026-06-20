import os
import hashlib
import base64
from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet

# --- Cryptographic Helpers for PII Protection ---
def get_fernet():
    key = getattr(settings, 'ENCRYPTION_KEY', '')
    if not key:
        key = 'dev-harinos-pizza-secret-key-32-chars-minimum-fallback'
    # Base64url encode the SHA-256 hash of the key to ensure a valid 32-byte Fernet key
    key_hash = hashlib.sha256(key.encode('utf-8')).digest()
    key_b64 = base64.urlsafe_b64encode(key_hash)
    return Fernet(key_b64)

def encrypt_val(val):
    if val is None:
        return val
    val_str = str(val)
    f = get_fernet()
    return f.encrypt(val_str.encode('utf-8')).decode('utf-8')

def decrypt_val(val, target_type=str):
    if val is None:
        return val
    try:
        f = get_fernet()
        decrypted = f.decrypt(str(val).encode('utf-8')).decode('utf-8')
        if target_type == float:
            return float(decrypted)
        elif target_type == int:
            return int(decrypted)
        return decrypted
    except Exception:
        # Fallback to returning original value if decryption fails (e.g. plaintext database records)
        return val

def hash_phone(phone):
    if not phone:
        return ""
    cleaned = "".join(c for c in str(phone) if c.isdigit())
    return hashlib.sha256(cleaned.encode('utf-8')).hexdigest()


class MenuItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    payload = models.JSONField()
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.id


class Outlet(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    payload = models.JSONField()
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.id


class Offer(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    payload = models.JSONField()
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.id


class Customer(models.Model):
    id = models.CharField(max_length=128, primary_key=True)
    payload = models.JSONField()
    phone = models.CharField(max_length=255, db_index=True)
    phone_hash = models.CharField(max_length=64, db_index=True, null=True, blank=True)
    email = models.CharField(max_length=512, null=True, blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super().from_db(db, field_names, values)
        instance.phone = decrypt_val(instance.phone)
        if instance.email:
            instance.email = decrypt_val(instance.email)
        
        # Transparently decrypt sensitive payload keys
        if isinstance(instance.payload, dict):
            for key in ['phone', 'email', 'address', 'addresses']:
                if key in instance.payload:
                    instance.payload[key] = decrypt_val(instance.payload[key])
            if 'walletBalance' in instance.payload:
                instance.payload['walletBalance'] = decrypt_val(instance.payload['walletBalance'], target_type=float)
        return instance

    def save(self, *args, **kwargs):
        # 1. Back up plaintext fields
        orig_phone = self.phone
        orig_email = self.email
        orig_payload = self.payload

        # 2. Update hashed search index
        self.phone_hash = hash_phone(orig_phone)

        # 3. Encrypt sensitive payload properties
        if isinstance(orig_payload, dict):
            new_payload = orig_payload.copy()
            for key in ['phone', 'email', 'address', 'addresses']:
                if key in new_payload:
                    new_payload[key] = encrypt_val(new_payload[key])
            if 'walletBalance' in new_payload:
                new_payload['walletBalance'] = encrypt_val(new_payload['walletBalance'])
            self.payload = new_payload

        # 4. Encrypt direct PII fields
        self.phone = encrypt_val(orig_phone)
        if orig_email:
            self.email = encrypt_val(orig_email)

        try:
            super().save(*args, **kwargs)
        finally:
            # 5. Restore plaintexts for post-save in-memory code
            self.phone = orig_phone
            self.email = orig_email
            self.payload = orig_payload

    def __str__(self):
        return f"{self.id} ({self.phone})"


class Order(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    payload = models.JSONField()
    status = models.CharField(max_length=32, db_index=True)
    received_at = models.DateTimeField(db_index=True)
    outlet_id = models.CharField(max_length=128, null=True, blank=True, db_index=True)
    customer_phone = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    customer_phone_hash = models.CharField(max_length=64, null=True, blank=True, db_index=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super().from_db(db, field_names, values)
        instance.customer_phone = decrypt_val(instance.customer_phone)
        
        # Transparently decrypt order payload properties
        if isinstance(instance.payload, dict):
            for key in ['customerPhone', 'customerEmail', 'address']:
                if key in instance.payload:
                    instance.payload[key] = decrypt_val(instance.payload[key])
            if 'customer' in instance.payload and isinstance(instance.payload['customer'], dict):
                cust = instance.payload['customer']
                for key in ['phone', 'email', 'address']:
                    if key in cust:
                        cust[key] = decrypt_val(cust[key])
        return instance

    def save(self, *args, **kwargs):
        orig_phone = self.customer_phone
        orig_payload = self.payload

        self.customer_phone_hash = hash_phone(orig_phone)

        if isinstance(orig_payload, dict):
            new_payload = orig_payload.copy()
            for key in ['customerPhone', 'customerEmail', 'address']:
                if key in new_payload:
                    new_payload[key] = encrypt_val(new_payload[key])
            if 'customer' in new_payload and isinstance(new_payload['customer'], dict):
                cust = new_payload['customer'].copy()
                for key in ['phone', 'email', 'address']:
                    if key in cust:
                        cust[key] = encrypt_val(cust[key])
                new_payload['customer'] = cust
            self.payload = new_payload

        self.customer_phone = encrypt_val(orig_phone)

        try:
            super().save(*args, **kwargs)
        finally:
            self.customer_phone = orig_phone
            self.payload = orig_payload

    def __str__(self):
        return self.id


class WalletTransaction(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    payload = models.JSONField()
    created_at = models.DateTimeField(db_index=True)

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super().from_db(db, field_names, values)
        if isinstance(instance.payload, dict):
            for key in ['phone', 'email', 'customerPhone']:
                if key in instance.payload:
                    instance.payload[key] = decrypt_val(instance.payload[key])
        return instance

    def save(self, *args, **kwargs):
        orig_payload = self.payload
        if isinstance(orig_payload, dict):
            new_payload = orig_payload.copy()
            for key in ['phone', 'email', 'customerPhone']:
                if key in new_payload:
                    new_payload[key] = encrypt_val(new_payload[key])
            self.payload = new_payload
        try:
            super().save(*args, **kwargs)
        finally:
            self.payload = orig_payload

    def __str__(self):
        return self.id


class Setting(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    payload = models.JSONField()

    def __str__(self):
        return self.id


class BlockedCustomer(models.Model):
    phone = models.CharField(max_length=255, primary_key=True)
    phone_hash = models.CharField(max_length=64, db_index=True, null=True, blank=True)
    blocked_at = models.DateTimeField()
    customer_id = models.CharField(max_length=128)
    name = models.CharField(max_length=255)

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super().from_db(db, field_names, values)
        instance.phone = decrypt_val(instance.phone)
        return instance

    def save(self, *args, **kwargs):
        orig_phone = self.phone
        self.phone_hash = hash_phone(orig_phone)
        self.phone = encrypt_val(orig_phone)
        try:
            super().save(*args, **kwargs)
        finally:
            self.phone = orig_phone

    def __str__(self):
        return f"{self.phone} - {self.name}"


class StaffUser(models.Model):
    username = models.CharField(max_length=128, primary_key=True)
    payload = models.JSONField()
    role = models.CharField(max_length=32)

    def __str__(self):
        return self.username


class NotificationToken(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    user_id = models.CharField(max_length=128, db_index=True)
    fcm_token = models.TextField()
    role = models.CharField(max_length=32, db_index=True)
    outlet_id = models.CharField(max_length=128, null=True, blank=True, db_index=True)
    device_type = models.CharField(max_length=64, default='browser')
    device_info = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    last_used_at = models.DateTimeField()

    def __str__(self):
        return self.id


class AuditLog(models.Model):
    user = models.CharField(max_length=128, db_index=True)
    action = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    ip_address = models.CharField(max_length=45, db_index=True)

    def __str__(self):
        return f"{self.user} - {self.action} @ {self.timestamp}"
