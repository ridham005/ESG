/**
 * Multi-Device State Synchronization Utilities
 * Supports URL Hash State Transfer, JSON Export/Import, and BroadcastChannel.
 */
import { EcoSphereState } from '../types/esg';

const BROADCAST_CHANNEL_NAME = 'ecosphere_multi_device_broadcast';

export class DeviceSyncEngine {
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    }
  }

  // Broadcast state to all other open tabs/windows
  public broadcastState(state: EcoSphereState): void {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'ECOSPHERE_STATE_UPDATE', state, ts: Date.now() });
      } catch (e) {
        console.warn('Broadcast failed:', e);
      }
    }
  }

  // Subscribe to broadcasts
  public onBroadcast(callback: (state: EcoSphereState) => void): () => void {
    if (!this.channel) return () => {};

    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ECOSPHERE_STATE_UPDATE' && event.data.state) {
        callback(event.data.state);
      }
    };

    this.channel.addEventListener('message', handler);
    return () => {
      this.channel?.removeEventListener('message', handler);
    };
  }

  // Generate a shareable URL containing the current state
  public generateShareableLink(state: EcoSphereState): string {
    try {
      const json = JSON.stringify(state);
      const encoded = btoa(encodeURIComponent(json));
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}#sync=${encoded}`;
    } catch (e) {
      console.error('Failed to generate share link:', e);
      return window.location.href;
    }
  }

  // Check URL hash for shared state on boot
  public parseUrlHashState(): EcoSphereState | null {
    try {
      if (typeof window === 'undefined') return null;
      const hash = window.location.hash;
      if (hash && hash.includes('#sync=')) {
        const payload = hash.replace('#sync=', '');
        const json = decodeURIComponent(atob(payload));
        const parsed = JSON.parse(json);
        
        // Clean URL hash without reloading
        window.history.replaceState(null, '', window.location.pathname);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse URL hash state:', e);
    }
    return null;
  }

  // Export state to downloadable JSON file
  public exportStateToJsonFile(state: EcoSphereState): void {
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecosphere-esg-backup-${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const syncEngine = new DeviceSyncEngine();
