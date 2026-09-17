import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type {
  ChatMessage,
  ConnectionStatus,
  ConnectionType,
  UserPreferences,
  SignalData,
  AppMode,
  GroupRoom,
  GroupMessage,
  GroupUser,
  DirectMessage,
  DirectUser,
  PinnedUser,
  SharedLink,
} from '../types/chat';
import { WebRTCManager } from '../utils/webrtc';
import type { WebRTCMetadata } from '../utils/webrtc';
import { soundEffects } from '../utils/sound';
import { filterText } from '../utils/profanity';

interface ChatContextType {
  // App mode
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;

  // Profile
  myUserId: string | null;
  tempUsername: string;
  avatarColor: string;
  hasEnteredChat: boolean;
  setTempUsername: (username: string, color?: string) => void;
  enterChat: (username: string, color?: string) => void;
  resetToWelcome: () => void;

  // Direct Messaging (DM) & Pinned Contacts
  activeDmUser: DirectUser | null;
  directMessages: Record<string, DirectMessage[]>;
  pinnedUsers: PinnedUser[];
  openDirectMessage: (user: DirectUser) => void;
  closeDirectMessage: () => void;
  sendDirectMessage: (text: string, media?: { mediaType: 'photo' | 'gif'; mediaUrl: string; ephemeralTimer?: number }) => void;
  isDmWebRtcConnected: (peerId: string) => boolean;
  pinUser: (user: DirectUser) => void;
  unpinUser: (userId: string) => void;
  togglePinUser: (user: DirectUser) => void;
  isUserPinned: (userId: string) => boolean;
  clearAllDMs: () => void;
  expireDirectMessageMedia: (peerId: string, msgId: string) => void;
  expireGroupMessageMedia: (msgId: string) => void;
  expireChatMessageMedia: (msgId: string) => void;

  // Security & Content Protection
  screenshotProtection: boolean;
  toggleScreenshotProtection: () => void;

  // Group Rooms State
  groupList: GroupRoom[];
  activeGroup: GroupRoom | null;
  groupUsers: GroupUser[];
  groupMessages: GroupMessage[];
  typingGroupUsers: string[];

  // Group Actions
  joinGroupRoom: (groupId: string) => void;
  leaveGroupRoom: () => void;
  sendGroupMessage: (text: string, media?: { mediaType: 'photo' | 'gif'; mediaUrl: string; ephemeralTimer?: number }) => void;
  sendGroupTyping: (isTyping: boolean) => void;
  createGroupRoom: (name: string, topic: string, category: string) => void;
  refreshGroups: () => void;

  // Blocked users & Modals
  blockedUsersCount: number;
  activeModal: 'none' | 'report' | 'safety' | 'privacy' | 'terms' | 'settings' | 'username' | 'create_group' | 'private_dms' | 'share_room' | 'join_by_code';
  shareRoomData: { id: string; name: string; topic?: string; isCustom?: boolean } | null;
  setShareRoomData: (data: { id: string; name: string; topic?: string; isCustom?: boolean } | null) => void;
  openShareModal: (room?: { id: string; name: string; topic?: string; isCustom?: boolean }) => void;

  // Incoming DM Notifications
  incomingDmToast: {
    senderId: string;
    senderName: string;
    avatarColor: string;
    text: string;
    timestamp: number;
    mediaType?: 'photo' | 'gif';
  } | null;
  clearIncomingDmToast: () => void;

  // Shared Links (No-ban & unrestricted)
  sharedLinks: SharedLink[];
  sharePublicLink: (url: string, title?: string, channel?: string) => Promise<void>;
  refreshSharedLinks: () => void;

  // 1-on-1 Stranger Actions
  startChat: () => void;
  nextStranger: () => void;
  stopChat: () => void;
  sendMessage: (text: string, media?: { mediaType: 'photo' | 'gif'; mediaUrl: string; ephemeralTimer?: number }) => void;
  sendTyping: (isTyping: boolean) => void;
  reportStranger: (reason: string, details?: string) => void;
  blockStranger: () => void;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  setActiveModal: (modal: 'none' | 'report' | 'safety' | 'privacy' | 'terms' | 'settings' | 'username' | 'create_group' | 'private_dms' | 'share_room' | 'join_by_code') => void;
  unblockAllUsers: () => void;
  clearChat: () => void;
  clearGroupMessages: () => void;
  clearDirectMessages: (userId: string) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  username: '',
  avatarColor: '#6366f1',
  interests: [],
  soundEnabled: true,
  blurProfanity: false,
  theme: 'dark',
  autoNextOnReport: true,
  ageConfirmed: true,
};

const INITIAL_DEFAULT_GROUPS: GroupRoom[] = [
  {
    id: 'general',
    name: '🌐 General Lounge',
    topic: 'Aapka Swagat Hai! Open chat room for everyone to hang out and talk.',
    category: 'Main',
    icon: 'MessageSquare',
    userCount: 1,
  },
  {
    id: 'gaming',
    name: '🎮 Gaming & Esports',
    topic: 'BGMI, Valorant, FreeFire, GTA, PC & Mobile gaming discussions!',
    category: 'Gaming',
    icon: 'Gamepad2',
    userCount: 1,
  },
  {
    id: 'music',
    name: '🎵 Music & Vibe',
    topic: 'Share song recommendations, playlists, acoustic covers, and vibe together.',
    category: 'Entertainment',
    icon: 'Music',
    userCount: 1,
  },
  {
    id: 'tech',
    name: '💻 Tech & AI Hub',
    topic: 'Coding, smartphones, AI tools, startups & career chit-chat.',
    category: 'Tech',
    icon: 'Code',
    userCount: 1,
  },
  {
    id: 'movies',
    name: '🎬 Movies & Binge',
    topic: 'Bollywood, Hollywood, Anime, Netflix shows & movie reviews.',
    category: 'Entertainment',
    icon: 'Film',
    userCount: 1,
  },
  {
    id: 'hangout',
    name: '☕ Late Night Hangout',
    topic: 'Casual jokes, late night talks, storytelling & fun banters.',
    category: 'Social',
    icon: 'Coffee',
    userCount: 1,
  },
  {
    id: 'friendship',
    name: '❤️ Friendship Corner',
    topic: 'Make new friends from everywhere in a safe and friendly space.',
    category: 'Social',
    icon: 'Heart',
    userCount: 1,
  },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>('groups');

  // User Profile
  const [myUserId, setMyUserId] = useState<string>(() => {
    try {
      const saved = sessionStorage.getItem('chatindian_user_id') || localStorage.getItem('chatindian_user_id');
      if (saved && saved.startsWith('usr_')) return saved;
      const created = 'usr_' + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('chatindian_user_id', created);
      localStorage.setItem('chatindian_user_id', created);
      return created;
    } catch (e) {
      return 'usr_' + Math.random().toString(36).substring(2, 10);
    }
  });
  const [tempUsername, setTempUsernameState] = useState<string>(() => {
    try {
      const sessionSaved = sessionStorage.getItem('temp_username');
      if (sessionSaved && sessionSaved.trim()) return sessionSaved.trim();
      const saved = localStorage.getItem('temp_username');
      if (saved && saved.trim()) return saved.trim();
    } catch (e) {
      /* ignore */
    }
    return 'Guest_' + Math.floor(1000 + Math.random() * 9000);
  });

  const [avatarColor, setAvatarColor] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('temp_avatar_color');
      if (saved) return saved;
    } catch (e) {
      /* ignore */
    }
    return '#6366f1';
  });

  const [hasEnteredChat, setHasEnteredChat] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('has_entered_chat') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Group Rooms State
  const [groupList, setGroupList] = useState<GroupRoom[]>(INITIAL_DEFAULT_GROUPS);
  const [activeGroup, setActiveGroup] = useState<GroupRoom | null>(null);
  const [groupUsers, setGroupUsers] = useState<GroupUser[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [typingGroupUsers, setTypingGroupUsers] = useState<string[]>([]);

  // Direct Messaging (DM) State
  const [activeDmUser, setActiveDmUser] = useState<DirectUser | null>(null);
  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>({});
  const [dmConnectedPeers, setDmConnectedPeers] = useState<string[]>([]);
  const [pinnedUsers, setPinnedUsers] = useState<PinnedUser[]>(() => {
    try {
      const saved = localStorage.getItem('chatindian_pinned_dms');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Incoming DM Notification Toast
  const [incomingDmToast, setIncomingDmToast] = useState<{
    senderId: string;
    senderName: string;
    avatarColor: string;
    text: string;
    timestamp: number;
    mediaType?: 'photo' | 'gif';
  } | null>(null);

  // Anti-Screenshot & Content Protection Setting
  const [screenshotProtection, setScreenshotProtection] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chatindian_screenshot_protection');
      return saved !== null ? JSON.parse(saved) : true; // Enabled by default for privacy
    } catch (e) {
      return true;
    }
  });

  const toggleScreenshotProtection = useCallback(() => {
    setScreenshotProtection((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('chatindian_screenshot_protection', JSON.stringify(next));
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearIncomingDmToast = useCallback(() => {
    setIncomingDmToast(null);
  }, []);

  // Sync pinned users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chatindian_pinned_dms', JSON.stringify(pinnedUsers));
    } catch (e) {
      /* ignore */
    }
  }, [pinnedUsers]);

  // 1-on-1 Stranger State
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [connectionType, setConnectionType] = useState<ConnectionType>('none');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [strangerIsTyping, setStrangerIsTyping] = useState<boolean>(false);
  const [onlineStats, setOnlineStats] = useState({ onlineCount: 1, searchingCount: 0 });
  const [currentPeerId, setCurrentPeerId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'report' | 'safety' | 'privacy' | 'terms' | 'settings' | 'username' | 'create_group' | 'private_dms' | 'share_room' | 'join_by_code'>('none');
  const [shareRoomData, setShareRoomData] = useState<{ id: string; name: string; topic?: string; isCustom?: boolean } | null>(null);

  // Blocked users stored in localStorage
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stranger_chat_blocked_users');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // User preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('stranger_chat_preferences');
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch (e) {
      return DEFAULT_PREFERENCES;
    }
  });

  const socketRef = useRef<WebSocket | null>(null);
  const webrtcRef = useRef<WebRTCManager | null>(null);
  const dmWebRTCConnectionsRef = useRef<Map<string, WebRTCManager>>(new Map());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const groupTypingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  const myUserIdRef = useRef<string | null>(myUserId);
  const tempUsernameRef = useRef(tempUsername);
  const avatarColorRef = useRef(avatarColor);
  const activeDmUserRef = useRef<DirectUser | null>(activeDmUser);
  const activeGroupRef = useRef<GroupRoom | null>(activeGroup);
  const groupListRef = useRef<GroupRoom[]>(groupList);
  const preferencesRef = useRef<UserPreferences>(preferences);

  useEffect(() => {
    myUserIdRef.current = myUserId;
  }, [myUserId]);

  useEffect(() => {
    tempUsernameRef.current = tempUsername;
  }, [tempUsername]);

  useEffect(() => {
    avatarColorRef.current = avatarColor;
  }, [avatarColor]);

  useEffect(() => {
    activeDmUserRef.current = activeDmUser;
  }, [activeDmUser]);

  useEffect(() => {
    activeGroupRef.current = activeGroup;
  }, [activeGroup]);

  useEffect(() => {
    groupListRef.current = groupList;
  }, [groupList]);

  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  // Centralized incoming direct message handler (used by both WebRTC DataChannel & WebSocket Relay)
  const handleReceiveDirectMessage = useCallback(
    (msgData: {
      id?: string;
      senderId: string;
      senderName: string;
      avatarColor?: string;
      targetUserId?: string;
      text: string;
      timestamp?: number;
      mediaType?: 'photo' | 'gif';
      mediaUrl?: string;
      ephemeralTimer?: number;
    }) => {
      const peerId = msgData.senderId;
      if (!peerId) return;

      const filteredText = filterText(msgData.text || '', preferencesRef.current.blurProfanity);
      const isCurrentlyActiveWithSender = activeDmUserRef.current?.id === peerId;
      const msgTime = msgData.timestamp || Date.now();
      const senderName = msgData.senderName || 'Anonymous';
      const senderAvatar = msgData.avatarColor || '#6366f1';
      const msgId = msgData.id || ('dm_' + Math.random().toString(36).substring(2, 10));

      const msg: DirectMessage = {
        id: msgId,
        senderId: peerId,
        senderName: senderName,
        avatarColor: senderAvatar,
        targetUserId: myUserIdRef.current || msgData.targetUserId || '',
        text: filteredText,
        timestamp: msgTime,
        isMine: false,
        mediaType: msgData.mediaType,
        mediaUrl: msgData.mediaUrl,
        ephemeralTimer: msgData.ephemeralTimer,
      };

      setDirectMessages((prev) => {
        const list = prev[peerId] || [];
        const isDuplicate = list.some((m) => m.id === msgId);
        if (isDuplicate) return prev;
        return {
          ...prev,
          [peerId]: [...list, msg],
        };
      });

      soundEffects.playReceive();

      // AUTOMATICALLY add sender to Private DMs / pinnedUsers and increment unread count
      const previewText = msg.mediaType ? `[${msg.mediaType === 'photo' ? '📷 Photo' : '🎬 GIF'}] ${filteredText}` : filteredText;

      setPinnedUsers((prev) => {
        const existing = prev.find((u) => u.id === peerId);
        if (existing) {
          return [
            {
              ...existing,
              username: senderName,
              avatarColor: senderAvatar,
              lastMessage: previewText,
              lastMessageTime: msgTime,
              unreadCount: isCurrentlyActiveWithSender ? 0 : (existing.unreadCount || 0) + 1,
            },
            ...prev.filter((u) => u.id !== peerId),
          ];
        } else {
          return [
            {
              id: peerId,
              username: senderName,
              avatarColor: senderAvatar,
              lastMessage: previewText,
              lastMessageTime: msgTime,
              unreadCount: isCurrentlyActiveWithSender ? 0 : 1,
            },
            ...prev,
          ];
        }
      });

      // Show toast if the user does not currently have this chat modal actively open
      if (!isCurrentlyActiveWithSender) {
        setIncomingDmToast({
          senderId: peerId,
          senderName: senderName,
          avatarColor: senderAvatar,
          text: previewText,
          timestamp: msgTime,
          mediaType: msg.mediaType,
        });
      }
    },
    []
  );

  // Helper to initialize WebRTC for a specific targeted DM Peer ID
  const initDmWebRTC = useCallback(
    (targetPeerId: string, role: 'initiator' | 'receiver', peerInfo?: { username: string; avatarColor?: string }) => {
      if (!targetPeerId) return null;

      const existing = dmWebRTCConnectionsRef.current.get(targetPeerId);
      if (existing) {
        return existing;
      }

      const manager = new WebRTCManager({
        onMessage: (text: string, metadata?: WebRTCMetadata) => {
          handleReceiveDirectMessage({
            id: metadata?.id,
            senderId: metadata?.senderId || targetPeerId,
            senderName: metadata?.senderName || peerInfo?.username || 'Peer',
            avatarColor: metadata?.avatarColor || peerInfo?.avatarColor || '#6366f1',
            targetUserId: myUserIdRef.current || '',
            text: text,
            timestamp: metadata?.timestamp || Date.now(),
            mediaType: metadata?.mediaType,
            mediaUrl: metadata?.mediaUrl,
            ephemeralTimer: metadata?.ephemeralTimer,
          });
        },
        onTyping: () => {
          // Targeted DM typing
        },
        onSignal: (signalData: SignalData) => {
          const ws = socketRef.current;
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: 'dm_signal',
                targetUserId: targetPeerId,
                signal: signalData,
              })
            );
          }
        },
        onConnected: () => {
          setDmConnectedPeers((prev) => (prev.includes(targetPeerId) ? prev : [...prev, targetPeerId]));
        },
        onDisconnected: () => {
          setDmConnectedPeers((prev) => prev.filter((id) => id !== targetPeerId));
          dmWebRTCConnectionsRef.current.delete(targetPeerId);
        },
        onFallbackNeeded: () => {
          setDmConnectedPeers((prev) => prev.filter((id) => id !== targetPeerId));
          dmWebRTCConnectionsRef.current.delete(targetPeerId);
        },
      });

      dmWebRTCConnectionsRef.current.set(targetPeerId, manager);
      manager.init(role);
      return manager;
    },
    [handleReceiveDirectMessage]
  );

  // Sync theme to <html> tag
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    soundEffects.setEnabled(preferences.soundEnabled);
  }, [preferences.theme, preferences.soundEnabled]);

  // Persist preferences
  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('stranger_chat_preferences', JSON.stringify(next));
      return next;
    });
  }, []);

  // Sync blocked users
  useEffect(() => {
    localStorage.setItem('stranger_chat_blocked_users', JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  const addSystemMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: 'sys_' + Math.random().toString(36).substring(2, 9),
        sender: 'system',
        text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // WebRTC Callback Handlers for 1-on-1
  const handleIncomingMessage = useCallback(
    (
      text: string,
      metadata?: WebRTCMetadata | {
        id?: string;
        senderName?: string;
        avatarColor?: string;
        senderId?: string;
        timestamp?: number;
        mediaType?: 'photo' | 'gif';
        mediaUrl?: string;
        ephemeralTimer?: number;
      }
    ) => {
      const filtered = filterText(text, preferences.blurProfanity);
      setMessages((prev) => [
        ...prev,
        {
          id: metadata?.id || 'msg_' + Math.random().toString(36).substring(2, 9),
          sender: 'stranger',
          text: filtered,
          timestamp: metadata?.timestamp || Date.now(),
          status: 'delivered',
          mediaType: metadata?.mediaType,
          mediaUrl: metadata?.mediaUrl,
          ephemeralTimer: metadata?.ephemeralTimer,
        },
      ]);
      setStrangerIsTyping(false);
      soundEffects.playReceive();
    },
    [preferences.blurProfanity]
  );

  const handleStrangerTyping = useCallback((isTyping: boolean) => {
    setStrangerIsTyping(isTyping);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setStrangerIsTyping(false);
      }, 3500);
    }
  }, []);

  // Connect WebSocket connection
  const connectSocket = useCallback(() => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return socketRef.current;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      // Sync user profile upon socket connection using latest ref values
      ws.send(
        JSON.stringify({
          type: 'set_profile',
          userId: myUserIdRef.current,
          username: tempUsernameRef.current,
          avatarColor: avatarColorRef.current,
        })
      );
      ws.send(JSON.stringify({ type: 'get_groups' }));
      ws.send(JSON.stringify({ type: 'get_links' }));

      // If active group is already set in state, rejoin it on reconnect
      if (activeGroupRef.current) {
        ws.send(
          JSON.stringify({
            type: 'join_group',
            groupId: activeGroupRef.current.id,
          })
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'shared_links_list': {
            if (Array.isArray(data.links)) {
              setSharedLinks(data.links);
            }
            break;
          }

          case 'link_shared': {
            if (data.link) {
              setSharedLinks((prev) => [data.link, ...prev.filter((l) => l.id !== data.link.id)]);
            }
            break;
          }

          case 'profile_updated': {
            setMyUserId(data.userId);
            // DO NOT overwrite client's tempUsername or avatarColor with server defaults
            break;
          }

          case 'stats': {
            setOnlineStats({
              onlineCount: Math.max(1, data.onlineCount || 1),
              searchingCount: data.searchingCount || 0,
            });
            break;
          }

          case 'group_list': {
            if (Array.isArray(data.groups)) {
              setGroupList(data.groups);
            }
            break;
          }

          case 'group_joined': {
            setActiveGroup(data.group);
            setGroupUsers(data.users || []);
            setGroupMessages(
              (data.history || []).map((m: GroupMessage) => ({
                ...m,
                text: filterText(m.text, preferencesRef.current.blurProfanity),
              }))
            );
            soundEffects.playConnect();
            break;
          }

          case 'group_left': {
            setActiveGroup(null);
            setGroupUsers([]);
            setGroupMessages([]);
            setTypingGroupUsers([]);
            break;
          }

          case 'group_user_joined': {
            if (data.user) {
              setGroupUsers((prev) => {
                if (prev.some((u) => u.id === data.user.id)) return prev;
                return [...prev, data.user];
              });
            }
            break;
          }

          case 'group_user_left': {
            if (data.userId) {
              setGroupUsers((prev) => prev.filter((u) => u.id !== data.userId));
              setTypingGroupUsers((prev) => prev.filter((name) => name !== data.username));
            }
            break;
          }

          case 'group_user_updated': {
            if (data.id) {
              setGroupUsers((prev) =>
                prev.map((u) => (u.id === data.id ? { ...u, username: data.username, avatarColor: data.avatarColor } : u))
              );
            }
            break;
          }

          case 'group_message': {
            if (data.message) {
              const msg: GroupMessage = {
                ...data.message,
                text: filterText(data.message.text, preferences.blurProfanity),
              };

              setGroupMessages((prev) => [...prev, msg]);

              if (msg.senderId !== myUserId && !msg.isSystem) {
                soundEffects.playReceive();
              }
            }
            break;
          }

          case 'group_typing': {
            const { username, isTyping } = data;
            if (!username) break;

            if (isTyping) {
              setTypingGroupUsers((prev) => (prev.includes(username) ? prev : [...prev, username]));

              if (groupTypingTimeoutsRef.current[username]) {
                clearTimeout(groupTypingTimeoutsRef.current[username]);
              }

              groupTypingTimeoutsRef.current[username] = setTimeout(() => {
                setTypingGroupUsers((prev) => prev.filter((n) => n !== username));
              }, 3500);
            } else {
              setTypingGroupUsers((prev) => prev.filter((n) => n !== username));
            }
            break;
          }

          case 'group_created': {
            if (data.groupId) {
              setShareRoomData({
                id: data.groupId,
                name: data.name || 'Private Chatroom',
                topic: data.topic,
                isCustom: true,
              });
              setActiveModal('share_room');
            }
            break;
          }

          case 'group_error': {
            if (data.message) {
              // Gracefully handle room not found
              alert(data.message);
            }
            break;
          }

          case 'dm_received': {
            if (data.message) {
              handleReceiveDirectMessage({
                id: data.message.id,
                senderId: data.message.senderId,
                senderName: data.message.senderName,
                avatarColor: data.message.avatarColor,
                targetUserId: data.message.targetUserId,
                text: data.message.text,
                timestamp: data.message.timestamp,
                mediaType: data.message.mediaType,
                mediaUrl: data.message.mediaUrl,
                ephemeralTimer: data.message.ephemeralTimer,
              });
            }
            break;
          }

          case 'dm_sent': {
            if (data.message) {
              const msg: DirectMessage = {
                ...data.message,
                text: filterText(data.message.text, preferencesRef.current.blurProfanity),
                isMine: true,
              };
              const peerId = msg.targetUserId;

              setDirectMessages((prev) => {
                const list = prev[peerId] || [];
                const alreadyExists = list.some((m) => m.id === msg.id);
                if (alreadyExists) return prev;
                return {
                  ...prev,
                  [peerId]: [...list, msg],
                };
              });

              setPinnedUsers((prev) => {
                const existing = prev.find((u) => u.id === peerId);
                if (existing) {
                  return [
                    {
                      ...existing,
                      lastMessage: msg.text,
                      lastMessageTime: msg.timestamp,
                    },
                    ...prev.filter((u) => u.id !== peerId),
                  ];
                }
                return prev;
              });
            }
            break;
          }

          case 'dm_history': {
            const { targetUserId, history } = data;
            if (targetUserId && Array.isArray(history)) {
              setDirectMessages((prev) => {
                const currentList = prev[targetUserId] || [];
                const msgMap = new Map<string, DirectMessage>();
                currentList.forEach((m) => msgMap.set(m.id, m));
                history.forEach((m: DirectMessage) => {
                  const isMine = m.senderId === myUserIdRef.current;
                  msgMap.set(m.id, {
                    ...m,
                    text: filterText(m.text, preferencesRef.current.blurProfanity),
                    isMine,
                  });
                });
                const sorted = Array.from(msgMap.values()).sort((a, b) => a.timestamp - b.timestamp);
                return {
                  ...prev,
                  [targetUserId]: sorted,
                };
              });
            }
            break;
          }

          case 'dm_signal': {
            const senderId = data.senderId;
            const signal = data.signal;
            if (senderId && signal) {
              let rtc = dmWebRTCConnectionsRef.current.get(senderId);
              if (!rtc) {
                rtc =
                  initDmWebRTC(senderId, 'receiver', {
                    username: data.senderName,
                    avatarColor: data.avatarColor,
                  }) || undefined;
              }
              rtc?.handleSignal(signal);
            }
            break;
          }

          // 1-on-1 Stranger Matching
          case 'matched': {
            setCurrentPeerId(data.peerId);
            setConnectionStatus('connected');
            setMessages([]);
            soundEffects.playConnect();

            addSystemMessage('You are now connected to a random stranger. Say hello!');
            addSystemMessage('Safety Reminder: Never share personal details, social accounts, or financial info.');

            if (webrtcRef.current) {
              webrtcRef.current.cleanup();
            }

            const webrtc = new WebRTCManager({
              onMessage: handleIncomingMessage,
              onTyping: handleStrangerTyping,
              onSignal: (signalData: SignalData) => {
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({ type: 'signal', signal: signalData }));
                }
              },
              onConnected: () => {
                setConnectionType('webrtc');
              },
              onDisconnected: () => {
                setConnectionType('websocket');
              },
              onFallbackNeeded: () => {
                setConnectionType('websocket');
              },
            });

            webrtcRef.current = webrtc;
            webrtc.init(data.role);
            break;
          }

          case 'signal': {
            if (webrtcRef.current) {
              webrtcRef.current.handleSignal(data.signal);
            }
            break;
          }

          case 'relay_message': {
            handleIncomingMessage(data.text, {
              id: data.id,
              mediaType: data.mediaType,
              mediaUrl: data.mediaUrl,
              ephemeralTimer: data.ephemeralTimer,
              timestamp: data.timestamp,
            });
            break;
          }

          case 'typing': {
            handleStrangerTyping(data.isTyping);
            break;
          }

          case 'peer_left': {
            setConnectionStatus('disconnected');
            setConnectionType('none');
            setStrangerIsTyping(false);
            soundEffects.playDisconnect();

            if (webrtcRef.current) {
              webrtcRef.current.cleanup();
            }

            if (data.reason === 'reported') {
              addSystemMessage('The chat has ended because a report was submitted.');
            } else {
              addSystemMessage('Stranger has disconnected.');
            }
            break;
          }

          case 'system_notice': {
            addSystemMessage(data.message);
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error('Socket parse error:', err);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('idle');
      setConnectionType('none');
    };

    return ws;
  }, [addSystemMessage, handleIncomingMessage, handleStrangerTyping, handleReceiveDirectMessage, initDmWebRTC]);

  // Connect socket on mount
  useEffect(() => {
    connectSocket();
    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.cleanup();
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectSocket]);

  // Temp Username / Profile updating
  const setTempUsername = useCallback((username: string, color?: string) => {
    const cleanName = username.trim().substring(0, 24) || 'Guest_' + Math.floor(1000 + Math.random() * 9000);
    const chosenColor = color || avatarColorRef.current;

    tempUsernameRef.current = cleanName;
    avatarColorRef.current = chosenColor;

    setTempUsernameState(cleanName);
    setAvatarColor(chosenColor);

    try {
      sessionStorage.setItem('temp_username', cleanName);
      localStorage.setItem('temp_username', cleanName);
      localStorage.setItem('temp_avatar_color', chosenColor);
    } catch (e) {
      /* ignore */
    }

    const ws = connectSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'set_profile',
          username: cleanName,
          avatarColor: chosenColor,
        })
      );
    }
  }, [connectSocket]);

  // Group Actions
  const joinGroupRoom = useCallback((groupId: string) => {
    setAppMode('groups');

    // Optimistically set active group so UI transitions immediately without delay
    const targetGroup = groupListRef.current.find((g) => g.id === groupId);
    if (targetGroup) {
      setActiveGroup(targetGroup);
    } else {
      setActiveGroup({
        id: groupId,
        name: 'Chatroom',
        topic: 'Live chat room',
        category: 'General',
        icon: 'MessageSquare',
        userCount: 1,
      });
    }

    const ws = connectSocket();
    const sendJoin = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'set_profile',
            username: tempUsernameRef.current,
            avatarColor: avatarColorRef.current,
          })
        );
        ws.send(JSON.stringify({ type: 'join_group', groupId }));
      }
    };

    if (ws.readyState === WebSocket.OPEN) {
      sendJoin();
    } else {
      ws.addEventListener('open', sendJoin, { once: true });
    }
  }, [connectSocket]);

  const openShareModal = useCallback((room?: { id: string; name: string; topic?: string; isCustom?: boolean }) => {
    if (room) {
      setShareRoomData(room);
    } else if (activeGroupRef.current) {
      setShareRoomData({
        id: activeGroupRef.current.id,
        name: activeGroupRef.current.name,
        topic: activeGroupRef.current.topic,
        isCustom: activeGroupRef.current.isCustom,
      });
    }
    setActiveModal('share_room');
  }, []);

  // Helper to extract room query or hash on page load
  const getRoomIdFromUrl = useCallback(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) return roomParam.trim();

      const hash = window.location.hash;
      if (hash.startsWith('#room=')) {
        return hash.replace('#room=', '').trim();
      }
      const hashParams = new URLSearchParams(hash.replace(/^#\/?/, ''));
      const hashRoom = hashParams.get('room');
      if (hashRoom) return hashRoom.trim();
    } catch (e) {
      /* ignore */
    }
    return null;
  }, []);

  // Auto-join if visitor opens an invite link directly
  useEffect(() => {
    const urlRoomId = getRoomIdFromUrl();
    if (urlRoomId) {
      setHasEnteredChat(true);
      setAppMode('groups');
      joinGroupRoom(urlRoomId);
    }
  }, [getRoomIdFromUrl, joinGroupRoom]);

  // Keep browser address bar in sync with active chatroom
  useEffect(() => {
    try {
      if (activeGroup) {
        const url = new URL(window.location.href);
        if (url.searchParams.get('room') !== activeGroup.id) {
          url.searchParams.set('room', activeGroup.id);
          window.history.replaceState(null, '', url.toString());
        }
      } else {
        const url = new URL(window.location.href);
        if (url.searchParams.has('room')) {
          url.searchParams.delete('room');
          window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
        }
      }
    } catch (e) {
      /* ignore */
    }
  }, [activeGroup]);

  const enterChat = useCallback(
    (username: string, color?: string) => {
      setTempUsername(username, color);
      setHasEnteredChat(true);
      setAppMode('groups');
      setActiveGroup(null);
      try {
        sessionStorage.setItem('has_entered_chat', 'true');
      } catch (e) {
        /* ignore */
      }
    },
    [setTempUsername]
  );

  const resetToWelcome = useCallback(() => {
    setHasEnteredChat(false);
    try {
      sessionStorage.removeItem('has_entered_chat');
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Direct Message Actions
  const pinUser = useCallback((user: DirectUser) => {
    setPinnedUsers((prev) => {
      if (prev.some((u) => u.id === user.id)) return prev;
      return [
        {
          id: user.id,
          username: user.username,
          avatarColor: user.avatarColor || '#6366f1',
          unreadCount: 0,
        },
        ...prev,
      ];
    });
  }, []);

  const unpinUser = useCallback((userId: string) => {
    setPinnedUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const clearAllDMs = useCallback(() => {
    setPinnedUsers([]);
    setDirectMessages({});
    try {
      localStorage.removeItem('chatindian_pinned_dms');
    } catch (e) {
      /* ignore */
    }
  }, []);

  const togglePinUser = useCallback((user: DirectUser) => {
    setPinnedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [
          {
            id: user.id,
            username: user.username,
            avatarColor: user.avatarColor || '#6366f1',
            unreadCount: 0,
          },
          ...prev,
        ];
      }
    });
  }, []);

  const isUserPinned = useCallback(
    (userId: string) => {
      return pinnedUsers.some((u) => u.id === userId);
    },
    [pinnedUsers]
  );

  const openDirectMessage = useCallback(
    (user: DirectUser) => {
      setActiveDmUser(user);
      activeDmUserRef.current = user;

      // Clear any incoming toast for this user
      setIncomingDmToast((curr) => (curr?.senderId === user.id ? null : curr));

      // Automatically add/update user in pinned list and clear unread
      setPinnedUsers((prev) => {
        const existing = prev.find((u) => u.id === user.id);
        if (existing) {
          return prev.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  username: user.username || u.username,
                  avatarColor: user.avatarColor || u.avatarColor,
                  unreadCount: 0,
                }
              : u
          );
        }
        return [
          {
            id: user.id,
            username: user.username,
            avatarColor: user.avatarColor || '#6366f1',
            unreadCount: 0,
          },
          ...prev,
        ];
      });

      // Request server-side message history for this conversation
      const ws = socketRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'get_dm_history', targetUserId: user.id }));
      }

      // Initialize WebRTC only if no active connection exists
      if (user.id && myUserIdRef.current && user.id !== myUserIdRef.current) {
        const existing = dmWebRTCConnectionsRef.current.get(user.id);
        if (!existing) {
          initDmWebRTC(user.id, 'initiator', user);
        }
      }
    },
    [initDmWebRTC]
  );

  const closeDirectMessage = useCallback(() => {
    setActiveDmUser(null);
    activeDmUserRef.current = null;
  }, []);

  const expireDirectMessageMedia = useCallback((peerId: string, msgId: string) => {
    setDirectMessages((prev) => {
      const list = prev[peerId];
      if (!list) return prev;
      return {
        ...prev,
        [peerId]: list.map((m) =>
          m.id === msgId ? { ...m, mediaUrl: undefined, isExpired: true } : m
        ),
      };
    });
  }, []);

  const expireGroupMessageMedia = useCallback((msgId: string) => {
    setGroupMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, mediaUrl: undefined, isExpired: true } : m
      )
    );
  }, []);

  const expireChatMessageMedia = useCallback((msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, mediaUrl: undefined, isExpired: true } : m
      )
    );
  }, []);

  // Periodic Auto-Purge of media older than 10 minutes to maintain client memory/storage
  useEffect(() => {
    const interval = setInterval(() => {
      const tenMinsAgo = Date.now() - 10 * 60 * 1000;

      setDirectMessages((prev: Record<string, DirectMessage[]>) => {
        let changed = false;
        const next: Record<string, DirectMessage[]> = {};
        for (const [peerId, list] of Object.entries(prev)) {
          const arr = list || [];
          next[peerId] = arr.map((m: DirectMessage) => {
            if (m.mediaUrl && m.timestamp < tenMinsAgo) {
              changed = true;
              return { ...m, mediaUrl: undefined, isExpired: true };
            }
            return m;
          });
        }
        return changed ? next : prev;
      });

      setGroupMessages((prev) => {
        let changed = false;
        const next = prev.map((m) => {
          if (m.mediaUrl && m.timestamp < tenMinsAgo) {
            changed = true;
            return { ...m, mediaUrl: undefined, isExpired: true };
          }
          return m;
        });
        return changed ? next : prev;
      });

      setMessages((prev) => {
        let changed = false;
        const next = prev.map((m) => {
          if (m.mediaUrl && m.timestamp < tenMinsAgo) {
            changed = true;
            return { ...m, mediaUrl: undefined, isExpired: true };
          }
          return m;
        });
        return changed ? next : prev;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const sendDirectMessage = useCallback(
    (text: string, media?: { mediaType: 'photo' | 'gif'; mediaUrl: string; ephemeralTimer?: number }) => {
      if (!activeDmUser) return;
      const trimmed = text.trim();
      if (!trimmed && !media?.mediaUrl) return;

      const targetPeerId = activeDmUser.id;
      const rtc = dmWebRTCConnectionsRef.current.get(targetPeerId);
      const msgId = 'dm_' + Math.random().toString(36).substring(2, 10);
      const now = Date.now();

      const displayText = trimmed || (media?.mediaType === 'gif' ? 'Sent a GIF' : 'Sent a Photo');

      const msg: DirectMessage = {
        id: msgId,
        senderId: myUserIdRef.current || 'you',
        senderName: tempUsernameRef.current,
        avatarColor: avatarColorRef.current,
        targetUserId: targetPeerId,
        text: filterText(displayText, preferencesRef.current.blurProfanity),
        timestamp: now,
        isMine: true,
        mediaType: media?.mediaType,
        mediaUrl: media?.mediaUrl,
        ephemeralTimer: media?.ephemeralTimer,
      };

      setDirectMessages((prev) => {
        const list = prev[targetPeerId] || [];
        if (list.some((m) => m.id === msgId)) return prev;
        return {
          ...prev,
          [targetPeerId]: [...list, msg],
        };
      });

      // Update sender's Private DM list with the latest sent message
      const previewText = media?.mediaType ? `[${media.mediaType === 'photo' ? '📷 Photo' : '🎬 GIF'}] ${displayText}` : displayText;

      setPinnedUsers((prev) => {
        const existing = prev.find((u) => u.id === targetPeerId);
        if (existing) {
          return [
            {
              ...existing,
              username: activeDmUser.username || existing.username,
              avatarColor: activeDmUser.avatarColor || existing.avatarColor,
              lastMessage: previewText,
              lastMessageTime: msg.timestamp,
            },
            ...prev.filter((u) => u.id !== targetPeerId),
          ];
        } else {
          return [
            {
              id: activeDmUser.id,
              username: activeDmUser.username,
              avatarColor: activeDmUser.avatarColor || '#6366f1',
              lastMessage: previewText,
              lastMessageTime: msg.timestamp,
              unreadCount: 0,
            },
            ...prev,
          ];
        }
      });

      const payloadMetadata = {
        id: msgId,
        senderId: myUserIdRef.current || '',
        senderName: tempUsernameRef.current,
        avatarColor: avatarColorRef.current,
        timestamp: now,
        mediaType: media?.mediaType,
        mediaUrl: media?.mediaUrl,
        ephemeralTimer: media?.ephemeralTimer,
      };

      // Try sending via WebRTC direct data channel
      if (rtc) {
        rtc.sendMessage(displayText, payloadMetadata);
      }

      // Always send over WebSocket relay as well (server caches & routes reliably)
      const ws = connectSocket();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'send_dm',
            id: msgId,
            targetUserId: targetPeerId,
            text: displayText,
            timestamp: now,
            mediaType: media?.mediaType,
            mediaUrl: media?.mediaUrl,
            ephemeralTimer: media?.ephemeralTimer,
          })
        );
      }

      soundEffects.playSend();
    },
    [activeDmUser, connectSocket]
  );

  const isDmWebRtcConnected = useCallback(
    (peerId: string) => {
      return dmConnectedPeers.includes(peerId);
    },
    [dmConnectedPeers]
  );

  const leaveGroupRoom = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'leave_group' }));
    }
    setActiveGroup(null);
    setGroupUsers([]);
    setGroupMessages([]);
    setTypingGroupUsers([]);
  }, []);

  const sendGroupMessage = useCallback(
    (text: string, media?: { mediaType: 'photo' | 'gif'; mediaUrl: string; ephemeralTimer?: number }) => {
      const trimmed = text.trim();
      if (!trimmed && !media?.mediaUrl) return;

      const ws = connectSocket();
      const currentGroupId = activeGroupRef.current?.id;
      const displayText = trimmed || (media?.mediaType === 'gif' ? 'Sent a GIF' : 'Sent a Photo');

      const sendMessagePayload = () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'send_group_message',
              groupId: currentGroupId,
              text: displayText,
              mediaType: media?.mediaType,
              mediaUrl: media?.mediaUrl,
              ephemeralTimer: media?.ephemeralTimer,
            })
          );
          soundEffects.playSend();
        }
      };

      if (ws.readyState === WebSocket.OPEN) {
        sendMessagePayload();
      } else {
        ws.addEventListener('open', sendMessagePayload, { once: true });
      }
    },
    [connectSocket]
  );

  const sendGroupTyping = useCallback((isTyping: boolean) => {
    const ws = connectSocket();
    const currentGroupId = activeGroupRef.current?.id;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'group_typing',
          groupId: currentGroupId,
          isTyping,
        })
      );
    }
  }, [connectSocket]);

  const createGroupRoom = useCallback((name: string, topic: string, category: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'create_group',
          name,
          topic,
          category,
        })
      );
    }
  }, []);

  const refreshGroups = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'get_groups' }));
    }
  }, []);

  // 1-on-1 Actions
  const startChat = useCallback(() => {
    const ws = connectSocket();

    const doJoin = () => {
      if (ws.readyState === WebSocket.OPEN) {
        setConnectionStatus('searching');
        setMessages([]);
        setStrangerIsTyping(false);
        ws.send(
          JSON.stringify({
            type: 'join_queue',
            interests: preferences.interests,
            blockedPeerIds: blockedUsers,
          })
        );
      }
    };

    if (ws.readyState === WebSocket.OPEN) {
      doJoin();
    } else {
      ws.onopen = () => {
        doJoin();
      };
    }
  }, [blockedUsers, connectSocket, preferences.interests]);

  const nextStranger = useCallback(() => {
    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
    }

    setConnectionStatus('searching');
    setConnectionType('none');
    setMessages([]);
    setStrangerIsTyping(false);
    setCurrentPeerId(null);
    soundEffects.playDisconnect();

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'leave_room', next: true }));
      socketRef.current.send(
        JSON.stringify({
          type: 'join_queue',
          interests: preferences.interests,
          blockedPeerIds: blockedUsers,
        })
      );
    } else {
      startChat();
    }
  }, [blockedUsers, preferences.interests, startChat]);

  const stopChat = useCallback(() => {
    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'leave_room', next: false }));
      socketRef.current.send(JSON.stringify({ type: 'leave_queue' }));
    }

    setConnectionStatus('idle');
    setConnectionType('none');
    setStrangerIsTyping(false);
    setCurrentPeerId(null);
    soundEffects.playDisconnect();

    addSystemMessage('Chat stopped. Click "Start Chat" to find another stranger.');
  }, [addSystemMessage]);

  const sendMessage = useCallback(
    (text: string, media?: { mediaType: 'photo' | 'gif'; mediaUrl: string; ephemeralTimer?: number }) => {
      const trimmed = text.trim();
      if ((!trimmed && !media?.mediaUrl) || connectionStatus !== 'connected') return;

      const displayText = trimmed || (media?.mediaType === 'gif' ? 'Sent a GIF' : 'Sent a Photo');
      const now = Date.now();
      const msgId = 'msg_' + Math.random().toString(36).substring(2, 9);
      let sentViaWebRTC = false;

      const payloadMetadata = {
        id: msgId,
        senderName: tempUsernameRef.current,
        avatarColor: avatarColorRef.current,
        timestamp: now,
        mediaType: media?.mediaType,
        mediaUrl: media?.mediaUrl,
        ephemeralTimer: media?.ephemeralTimer,
      };

      if (webrtcRef.current && connectionType === 'webrtc') {
        sentViaWebRTC = webrtcRef.current.sendMessage(displayText, payloadMetadata);
      }

      if (!sentViaWebRTC && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'relay_message',
            id: msgId,
            text: displayText,
            mediaType: media?.mediaType,
            mediaUrl: media?.mediaUrl,
            ephemeralTimer: media?.ephemeralTimer,
            timestamp: now,
          })
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          sender: 'you',
          text: filterText(displayText, preferencesRef.current.blurProfanity),
          timestamp: now,
          status: 'sent',
          mediaType: media?.mediaType,
          mediaUrl: media?.mediaUrl,
          ephemeralTimer: media?.ephemeralTimer,
        },
      ]);

      soundEffects.playSend();
    },
    [connectionStatus, connectionType]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (connectionStatus !== 'connected') return;

      if (webrtcRef.current && connectionType === 'webrtc') {
        webrtcRef.current.sendTyping(isTyping);
      } else if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'typing', isTyping }));
      }
    },
    [connectionStatus, connectionType]
  );

  const reportStranger = useCallback(
    (reason: string, details?: string) => {
      if (currentPeerId) {
        setBlockedUsers((prev) => Array.from(new Set([...prev, currentPeerId])));
      }

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'report_stranger',
            reason,
            details,
            autoNext: preferences.autoNextOnReport,
          })
        );
      }

      addSystemMessage('Stranger reported and blocked.');

      if (preferences.autoNextOnReport) {
        nextStranger();
      } else {
        stopChat();
      }
    },
    [currentPeerId, nextStranger, preferences.autoNextOnReport, stopChat, addSystemMessage]
  );

  const blockStranger = useCallback(() => {
    if (currentPeerId) {
      setBlockedUsers((prev) => Array.from(new Set([...prev, currentPeerId])));
      addSystemMessage('Stranger has been added to your local block list.');
    }
    nextStranger();
  }, [currentPeerId, nextStranger, addSystemMessage]);

  const sharePublicLink = useCallback(async (url: string, title?: string, channel?: string) => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    const ws = connectSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'share_link',
          url: cleanUrl,
          title: title?.trim(),
          channel: channel || 'chatindian',
        })
      );
    } else {
      try {
        const res = await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: cleanUrl,
            title: title?.trim(),
            senderName: tempUsernameRef.current,
            avatarColor: avatarColorRef.current,
            channel: channel || 'chatindian',
          }),
        });
        const data = await res.json();
        if (data.link) {
          setSharedLinks((prev) => [data.link, ...prev.filter((l) => l.id !== data.link.id)]);
        }
      } catch (err) {
        console.error('Failed to post link via API:', err);
      }
    }
  }, [connectSocket]);

  const refreshSharedLinks = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'get_links' }));
    } else {
      fetch('/api/links')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.links)) {
            setSharedLinks(data.links);
          }
        })
        .catch((e) => console.error('Failed to fetch shared links:', e));
    }
  }, []);

  const unblockAllUsers = useCallback(() => {
    setBlockedUsers([]);
    addSystemMessage('Block list cleared.');
  }, [addSystemMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const clearGroupMessages = useCallback(() => {
    setGroupMessages([]);
  }, []);

  const clearDirectMessages = useCallback((userId: string) => {
    setDirectMessages((prev) => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        appMode,
        setAppMode,
        myUserId,
        tempUsername,
        avatarColor,
        hasEnteredChat,
        setTempUsername,
        enterChat,
        resetToWelcome,
        activeDmUser,
        directMessages,
        pinnedUsers,
        openDirectMessage,
        closeDirectMessage,
        sendDirectMessage,
        isDmWebRtcConnected,
        pinUser,
        unpinUser,
        togglePinUser,
        isUserPinned,
        clearAllDMs,
        expireDirectMessageMedia,
        expireGroupMessageMedia,
        expireChatMessageMedia,
        screenshotProtection,
        toggleScreenshotProtection,
        sharedLinks,
        sharePublicLink,
        refreshSharedLinks,
        groupList,
        activeGroup,
        groupUsers,
        groupMessages,
        typingGroupUsers,
        joinGroupRoom,
        leaveGroupRoom,
        sendGroupMessage,
        sendGroupTyping,
        createGroupRoom,
        refreshGroups,
        connectionStatus,
        connectionType,
        messages,
        strangerIsTyping,
        onlineStats,
        preferences,
        currentPeerId,
        blockedUsersCount: blockedUsers.length,
        activeModal,
        shareRoomData,
        setShareRoomData,
        openShareModal,
        incomingDmToast,
        clearIncomingDmToast,
        startChat,
        nextStranger,
        stopChat,
        sendMessage,
        sendTyping,
        reportStranger,
        blockStranger,
        updatePreferences,
        setActiveModal,
        unblockAllUsers,
        clearChat,
        clearGroupMessages,
        clearDirectMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
