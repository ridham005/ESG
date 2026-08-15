/**
 * EcoSphere Real-Time Multi-Device Cloud Synchronization Engine
 * Automatically synchronizes challenges, ERP transactions, CSR proofs, audits, and settings across all devices.
 */
import { EcoSphereState } from '../types/esg';

const CLOUD_SYNC_ENDPOINT = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a0063514c8259b';

let lastSyncedTimestamp = 0;
let pushDebounceTimer: any = null;

export type CloudSyncStatus = 'CONNECTED' | 'SYNCING' | 'OFFLINE' | 'IDLE';

class CloudSyncService {
  private statusListeners: ((status: CloudSyncStatus) => void)[] = [];
  public currentStatus: CloudSyncStatus = 'IDLE';

  private setStatus(status: CloudSyncStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach(cb => cb(status));
  }

  public onStatusChange(callback: (status: CloudSyncStatus) => void) {
    this.statusListeners.push(callback);
    callback(this.currentStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
    };
  }

  // Pull latest shared state from cloud
  public async pullState(): Promise<{ success: boolean; state?: EcoSphereState; timestamp?: number }> {
    try {
      this.setStatus('SYNCING');
      const response = await fetch(CLOUD_SYNC_ENDPOINT, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        this.setStatus('OFFLINE');
        return { success: false };
      }

      const json = await response.json();
      if (json && json.data && json.data.state) {
        lastSyncedTimestamp = json.data.timestamp || Date.now();
        this.setStatus('CONNECTED');
        return {
          success: true,
          state: json.data.state,
          timestamp: lastSyncedTimestamp
        };
      }

      this.setStatus('CONNECTED');
      return { success: false };
    } catch (err) {
      console.warn('[CloudSync] Pull failed, operating in local-first mode:', err);
      this.setStatus('OFFLINE');
      return { success: false };
    }
  }

  // Push local changes to cloud
  public pushState(state: EcoSphereState): void {
    if (pushDebounceTimer) {
      clearTimeout(pushDebounceTimer);
    }

    pushDebounceTimer = setTimeout(async () => {
      try {
        this.setStatus('SYNCING');
        const now = Date.now();
        lastSyncedTimestamp = now;

        const res = await fetch(CLOUD_SYNC_ENDPOINT, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'EcoSphere Global Production Live Store',
            data: {
              timestamp: now,
              state: state
            }
          })
        });

        if (res.ok) {
          this.setStatus('CONNECTED');
        } else {
          this.setStatus('OFFLINE');
        }
      } catch (err) {
        console.warn('[CloudSync] Push error, saved locally:', err);
        this.setStatus('OFFLINE');
      }
    }, 800); // 800ms debounce
  }
}

export const cloudSync = new CloudSyncService();
