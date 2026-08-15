/**
 * EcoSphere Real-Time Multi-Device WebRTC Sync Engine
 * Direct browser-to-browser peer synchronization across laptops, phones, and tablets.
 */
import { joinRoom, Room } from 'trystero/nostr';
import { EcoSphereState } from '../types/esg';

export type PeerSyncStatus = 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';

class PeerSyncEngine {
  private room: Room | null = null;
  private sendStateAction: ((data: any, targetPeerId?: string) => void) | null = null;
  private stateListeners: ((state: EcoSphereState) => void)[] = [];
  private peerCountListeners: ((count: number) => void)[] = [];
  private connectedPeers: Set<string> = new Set();
  private currentStateGetter: (() => EcoSphereState) | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (typeof window === 'undefined') return;

      // Join the global synchronized room
      this.room = joinRoom({ appId: 'ecosphere_institutional_esg_v1' }, 'global_org_room');
      
      const [sendState, onState] = this.room.makeAction('STATE_SYNC');
      this.sendStateAction = sendState;

      // Listen for incoming state from other devices
      onState((remoteData: any, peerId: string) => {
        console.log('[PeerSync] Received real-time state from device:', peerId);
        if (remoteData && remoteData.state && remoteData.state.transactions && remoteData.state.master) {
          this.stateListeners.forEach(listener => listener(remoteData.state));
        }
      });

      // When a new phone/laptop connects, automatically send it our latest state!
      this.room.onPeerJoin((peerId: string) => {
        console.log('[PeerSync] New device connected to room:', peerId);
        this.connectedPeers.add(peerId);
        this.notifyPeerCount();

        if (this.currentStateGetter && this.sendStateAction) {
          const stateToSend = this.currentStateGetter();
          this.sendStateAction({ state: stateToSend, ts: Date.now() }, peerId);
        }
      });

      this.room.onPeerLeave((peerId: string) => {
        console.log('[PeerSync] Device disconnected:', peerId);
        this.connectedPeers.delete(peerId);
        this.notifyPeerCount();
      });

    } catch (e) {
      console.warn('[PeerSync] WebRTC initialization deferred:', e);
    }
  }

  public registerStateGetter(getter: () => EcoSphereState) {
    this.currentStateGetter = getter;
  }

  public onRemoteState(callback: (state: EcoSphereState) => void) {
    this.stateListeners.push(callback);
    return () => {
      this.stateListeners = this.stateListeners.filter(cb => cb !== callback);
    };
  }

  public onPeerCountChange(callback: (count: number) => void) {
    this.peerCountListeners.push(callback);
    callback(this.connectedPeers.size);
    return () => {
      this.peerCountListeners = this.peerCountListeners.filter(cb => cb !== callback);
    };
  }

  private notifyPeerCount() {
    const count = this.connectedPeers.size;
    this.peerCountListeners.forEach(cb => cb(count));
  }

  public broadcast(state: EcoSphereState) {
    if (this.sendStateAction && this.connectedPeers.size > 0) {
      try {
        this.sendStateAction({ state, ts: Date.now() });
      } catch (e) {
        console.warn('[PeerSync] Broadcast error:', e);
      }
    }
  }

  public getConnectedDevicesCount(): number {
    return this.connectedPeers.size;
  }
}

export const peerSync = new PeerSyncEngine();
