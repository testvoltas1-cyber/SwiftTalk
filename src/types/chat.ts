export type ConnectionStatus = 'idle' | 'searching' | 'connected' | 'disconnected';

export type ConnectionType = 'webrtc' | 'websocket' | 'none';

export type AppMode = 'groups' | 'stranger';

export interface ChatMessage {
  id: string;
  sender: 'you' | 'stranger' | 'system';
  text: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'delivered';
  mediaType?: 'photo' | 'gif';
  mediaUrl?: string;
  ephemeralTimer?: number; // In seconds (e.g. 5, 10, 30, 60, 300, 600)
  viewedAt?: number;
  isExpired?: boolean;
}

export interface GroupRoom {
  id: string;
  name: string;
  topic: string;
  category: string;
  icon: string;
  userCount: number;
  isCustom?: boolean;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
  avatarColor?: string;
  mediaType?: 'photo' | 'gif';
  mediaUrl?: string;
  ephemeralTimer?: number; // In seconds (e.g. 5, 10, 30, 60, 300, 600)
  viewedAt?: number;
  isExpired?: boolean;
}

export interface GroupUser {
  id: string;
  username: string;
  avatarColor: string;
  joinedAt: number;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatarColor?: string;
  targetUserId: string;
  text: string;
  timestamp: number;
  isMine?: boolean;
  mediaType?: 'photo' | 'gif';
  mediaUrl?: string;
  ephemeralTimer?: number; // In seconds (e.g. 5, 10, 30, 60, 300, 600)
  viewedAt?: number;
  isExpired?: boolean;
}

export interface DirectUser {
  id: string;
  username: string;
  avatarColor: string;
}

export interface PinnedUser {
  id: string;
  username: string;
  avatarColor: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount?: number;
}

export type SignalType = 'offer' | 'answer' | 'ice-candidate';

export interface SignalData {
  type: SignalType;
  sdp?: string;
  candidate?: RTCIceCandidateInit;
}

export interface UserPreferences {
  username: string;
  avatarColor: string;
  interests: string[];
  soundEnabled: boolean;
  blurProfanity: boolean;
  theme: 'dark' | 'light';
  autoNextOnReport: boolean;
  ageConfirmed: boolean;
}

export interface SharedLink {
  id: string;
  url: string;
  title?: string;
  senderName: string;
  avatarColor?: string;
  timestamp: number;
  channel?: string;
  safeFormatted?: string;
}
