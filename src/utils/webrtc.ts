import type { SignalData } from '../types/chat';

export interface WebRTCMetadata {
  id?: string;
  senderName?: string;
  avatarColor?: string;
  senderId?: string;
  timestamp?: number;
  mediaType?: 'photo' | 'gif';
  mediaUrl?: string;
  ephemeralTimer?: number;
}

export interface WebRTCCallbacks {
  onMessage: (text: string, metadata?: WebRTCMetadata) => void;
  onTyping: (isTyping: boolean) => void;
  onSignal: (signal: SignalData) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onFallbackNeeded: () => void;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
  ],
};

export class WebRTCManager {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private callbacks: WebRTCCallbacks;
  private role: 'initiator' | 'receiver' = 'initiator';
  private fallbackTimer: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;

  constructor(callbacks: WebRTCCallbacks) {
    this.callbacks = callbacks;
  }

  public async init(role: 'initiator' | 'receiver') {
    this.cleanup();
    this.role = role;
    this.isConnected = false;

    try {
      this.pc = new RTCPeerConnection(ICE_SERVERS);

      this.pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.callbacks.onSignal({
            type: 'ice-candidate',
            candidate: event.candidate.toJSON(),
          });
        }
      };

      this.pc.onconnectionstatechange = () => {
        if (!this.pc) return;
        const state = this.pc.connectionState;
        if (state === 'failed' || state === 'disconnected' || state === 'closed') {
          if (this.isConnected) {
            this.callbacks.onDisconnected();
          } else {
            this.callbacks.onFallbackNeeded();
          }
        }
      };

      if (this.role === 'initiator') {
        this.dataChannel = this.pc.createDataChannel('chat-channel', {
          ordered: true,
        });
        this.setupDataChannel(this.dataChannel);

        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);

        if (this.pc.localDescription) {
          this.callbacks.onSignal({
            type: 'offer',
            sdp: this.pc.localDescription.sdp,
          });
        }
      } else {
        this.pc.ondatachannel = (event) => {
          this.dataChannel = event.channel;
          this.setupDataChannel(this.dataChannel);
        };
      }

      // Start fallback timer if WebRTC takes longer than 6 seconds to establish
      this.fallbackTimer = setTimeout(() => {
        if (!this.isConnected) {
          this.callbacks.onFallbackNeeded();
        }
      }, 6000);
    } catch (err) {
      console.warn('WebRTC initialization failed, falling back to WebSocket relay:', err);
      this.callbacks.onFallbackNeeded();
    }
  }

  private setupDataChannel(dc: RTCDataChannel) {
    dc.onopen = () => {
      this.isConnected = true;
      if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
      this.callbacks.onConnected();
    };

    dc.onclose = () => {
      this.isConnected = false;
      this.callbacks.onDisconnected();
    };

    dc.onerror = () => {
      if (!this.isConnected) {
        this.callbacks.onFallbackNeeded();
      }
    };

    dc.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'message') {
          this.callbacks.onMessage(payload.text, {
            id: payload.id,
            senderName: payload.senderName,
            avatarColor: payload.avatarColor,
            senderId: payload.senderId,
            timestamp: payload.timestamp,
            mediaType: payload.mediaType,
            mediaUrl: payload.mediaUrl,
            ephemeralTimer: payload.ephemeralTimer,
          });
        } else if (payload.type === 'typing') {
          this.callbacks.onTyping(!!payload.isTyping);
        }
      } catch (e) {
        // Plain text fallback
        this.callbacks.onMessage(event.data);
      }
    };
  }

  public async handleSignal(signal: SignalData) {
    if (!this.pc) return;

    try {
      if (signal.type === 'offer' && signal.sdp) {
        await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: signal.sdp }));
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);

        if (this.pc.localDescription) {
          this.callbacks.onSignal({
            type: 'answer',
            sdp: this.pc.localDescription.sdp,
          });
        }
      } else if (signal.type === 'answer' && signal.sdp) {
        await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: signal.sdp }));
      } else if (signal.type === 'ice-candidate' && signal.candidate) {
        await this.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    } catch (err) {
      console.warn('Error handling WebRTC signal:', err);
      this.callbacks.onFallbackNeeded();
    }
  }

  public sendMessage(
    text: string,
    metadata?: WebRTCMetadata
  ): boolean {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      try {
        this.dataChannel.send(JSON.stringify({ type: 'message', text, ...metadata }));
        return true;
      } catch (err) {
        console.warn('WebRTC data channel send error (falling back to WebSocket):', err);
        return false;
      }
    }
    return false;
  }

  public sendTyping(isTyping: boolean) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      try {
        this.dataChannel.send(JSON.stringify({ type: 'typing', isTyping }));
      } catch (e) {
        // Ignore typing emission errors
      }
    }
  }

  public cleanup() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.isConnected = false;
  }
}
