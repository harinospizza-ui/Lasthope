/**
 * Harino's Pizza - Background Keep-Alive & Synchronization Service
 * 
 * Ensures the app continues running in the background on mobile devices (Android/iOS)
 * and PWAs so that real-time notifications for orders, wallet, and offers pop up
 * externally on the lock screen / notification tray while the user is outside the app.
 */

class BackgroundServiceManager {
  private isRunning: boolean = false;
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private worker: Worker | null = null;
  private wakeLock: any = null;
  private heartbeatTimer: any = null;
  private broadcastChannel: BroadcastChannel | null = null;

  /**
   * Start background keep-alive
   */
  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[BackgroundService] Starting persistent background keep-alive engine...');

    this.initAudioKeepAlive();
    this.initWorker();
    this.initBroadcastChannel();
    this.initWakeLock();
    this.initHeartbeat();
    this.registerPeriodicSync();
    this.listenToVisibilityChanges();
  }

  /**
   * Inaudible Audio Keep-Alive
   * Mobile OSes (Android Chrome, iOS Safari) allow webpages playing audio to retain full
   * background execution privileges without throttling WebSocket connections or pausing JS.
   */
  private initAudioKeepAlive() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      // Create an inaudible sub-bass carrier (20Hz at near-zero gain 0.00001)
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(20, this.audioCtx.currentTime); // Inaudible frequency
      this.gainNode.gain.setValueAtTime(0.00001, this.audioCtx.currentTime); // Near zero gain

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.oscillator.start();

      // Register MediaSession metadata so mobile OS recognizes continuous background process
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: "Harino's Pizza Live Alerts",
          artist: "Harino's Pure Veg Pizza",
          album: 'Order & Offer Tracker',
          artwork: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        });
        navigator.mediaSession.playbackState = 'playing';
      }
    } catch (err) {
      // AudioContext might require user gesture on some strict browsers
      console.warn('[BackgroundService] Audio keep-alive notice:', err);
    }
  }

  /**
   * Spawns an isolated Web Worker to run background interval ticks
   */
  private initWorker() {
    try {
      if (typeof Worker !== 'undefined') {
        this.worker = new Worker('/background-worker.js');
        this.worker.postMessage({ type: 'START', interval: 10000 });
        this.worker.onmessage = (e) => {
          if (e.data?.type === 'TICK') {
            this.onBackgroundTick();
          }
        };
      }
    } catch (err) {
      console.warn('[BackgroundService] Web worker notice:', err);
    }
  }

  /**
   * BroadcastChannel for instant inter-thread notification dispatch
   */
  private initBroadcastChannel() {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel('harinos_background_sync');
      }
    } catch {}
  }

  /**
   * Screen WakeLock API for active order tracking
   */
  public async initWakeLock() {
    try {
      if ('wakeLock' in navigator && (navigator as any).wakeLock?.request) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
      }
    } catch {}
  }

  /**
   * Heartbeat to keep Service Worker active
   */
  private initHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.pingServiceWorker();
    }, 15000);
  }

  private pingServiceWorker() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'HEARTBEAT',
        timestamp: Date.now(),
      });
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'HEARTBEAT',
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Background periodic sync registration
   */
  private async registerPeriodicSync() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('periodicSync' in registration) {
          const status = await (navigator as any).permissions?.query({
            name: 'periodic-background-sync' as any,
          });
          if (status?.state === 'granted') {
            await (registration as any).periodicSync.register('harinos-order-sync', {
              minInterval: 15 * 1000,
            });
            console.log('[BackgroundService] Periodic background sync registered successfully');
          }
        }
      } catch {}
    }
  }

  /**
   * Page visibility listener to ensure background stability
   */
  private listenToVisibilityChanges() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // App went to background - reinforce audio context and ping
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
        this.pingServiceWorker();
      } else if (document.visibilityState === 'visible') {
        // App returned to foreground
        this.initWakeLock();
      }
    });
  }

  /**
   * Triggered on every Web Worker tick
   */
  private onBackgroundTick() {
    this.pingServiceWorker();
  }

  /**
   * Stop background service
   */
  public stop() {
    this.isRunning = false;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.worker) {
      this.worker.postMessage({ type: 'STOP' });
      this.worker.terminate();
      this.worker = null;
    }
    if (this.oscillator) {
      try { this.oscillator.stop(); } catch {}
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch {}
      this.audioCtx = null;
    }
    if (this.wakeLock) {
      try { this.wakeLock.release(); } catch {}
      this.wakeLock = null;
    }
    if (this.broadcastChannel) {
      try { this.broadcastChannel.close(); } catch {}
      this.broadcastChannel = null;
    }
  }
}

export const BackgroundService = new BackgroundServiceManager();
