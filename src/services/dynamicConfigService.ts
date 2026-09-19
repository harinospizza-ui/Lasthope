import { Network, ConnectionStatus } from '@capacitor/network';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseClient';

export interface RemoteAnnouncement {
  enabled: boolean;
  text: string;
  badge?: string;
  promoCode?: string;
  linkText?: string;
  actionType?: 'copy_code' | 'scroll_menu' | 'open_offers' | 'external_link';
  actionTarget?: string;
  gradient?: string;
  icon?: string;
}

export interface DynamicAppTheme {
  themeMode?: 'default' | 'ipl_cricket' | 'festival_gold' | 'midnight_cravings';
  accentColor?: string;
}

export type NetworkStatusListener = (isOnline: boolean) => void;
export type AnnouncementListener = (announcement: RemoteAnnouncement | null) => void;

class DynamicConfigService {
  private isOnline = true;
  private currentAnnouncement: RemoteAnnouncement | null = null;
  private networkListeners = new Set<NetworkStatusListener>();
  private announcementListeners = new Set<AnnouncementListener>();
  private unsubFirestore: (() => void) | null = null;

  constructor() {
    this.initNetworkListener();
    this.initFirestoreListener();
  }

  private async initNetworkListener() {
    try {
      const status: ConnectionStatus = await Network.getStatus();
      this.isOnline = status.connected;
    } catch {
      this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    }

    try {
      Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
        this.updateNetworkStatus(status.connected);
      });
    } catch {
      if (typeof window !== 'undefined') {
        window.addEventListener('online', () => this.updateNetworkStatus(true));
        window.addEventListener('offline', () => this.updateNetworkStatus(false));
      }
    }
  }

  private updateNetworkStatus(online: boolean) {
    if (this.isOnline !== online) {
      this.isOnline = online;
      this.networkListeners.forEach((fn) => fn(this.isOnline));
    }
  }

  private initFirestoreListener() {
    try {
      const docRef = doc(db(), 'settings', 'announcements');
      this.unsubFirestore = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as RemoteAnnouncement;
            this.currentAnnouncement = data && data.enabled ? data : null;
          } else {
            this.currentAnnouncement = null;
          }
          this.announcementListeners.forEach((fn) => fn(this.currentAnnouncement));
        },
        (err) => {
          console.warn('[DynamicConfig] Announcement listener notice:', err);
        }
      );
    } catch (e) {
      console.warn('[DynamicConfig] Firestore listener init notice:', e);
    }
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public getAnnouncement(): RemoteAnnouncement | null {
    return this.currentAnnouncement;
  }

  public onNetworkChange(listener: NetworkStatusListener): () => void {
    this.networkListeners.add(listener);
    listener(this.isOnline);
    return () => {
      this.networkListeners.delete(listener);
    };
  }

  public onAnnouncementChange(listener: AnnouncementListener): () => void {
    this.announcementListeners.add(listener);
    listener(this.currentAnnouncement);
    return () => {
      this.announcementListeners.delete(listener);
    };
  }

  public destroy() {
    if (this.unsubFirestore) {
      this.unsubFirestore();
      this.unsubFirestore = null;
    }
    this.networkListeners.clear();
    this.announcementListeners.clear();
  }
}

export const dynamicConfig = new DynamicConfigService();
