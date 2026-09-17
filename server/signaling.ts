import { WebSocket, WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { GroupRoom, GroupMessage, GroupUser } from '../src/types/chat';

interface ClientSocket extends WebSocket {
  id: string;
  username: string;
  avatarColor: string;
  isAlive: boolean;
  roomId?: string; // For 1-on-1 stranger chat
  activeGroupId?: string; // For group chatroom
  interests?: string[];
  blockedPeerIds?: string[];
  isSearching?: boolean;
}

interface Room {
  id: string;
  peerA: ClientSocket;
  peerB: ClientSocket;
  createdAt: number;
}

interface InternalGroupRoom extends GroupRoom {
  members: Set<ClientSocket>;
  history: GroupMessage[];
}

const AVATAR_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6',
  '#06b6d4', '#f97316', '#3b82f6', '#14b8a6', '#e11d48'
];

export class SignalingServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientSocket> = new Map();
  private queue: ClientSocket[] = [];
  private rooms: Map<string, Room> = new Map();
  private groups: Map<string, InternalGroupRoom> = new Map();
  private dmHistory: Map<string, any[]> = new Map();
  private sharedLinks: Array<{
    id: string;
    url: string;
    title: string;
    senderName: string;
    avatarColor: string;
    timestamp: number;
    channel?: string;
  }> = [];
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.initDefaultGroups();
    this.init();
  }

  public getLinks() {
    return this.sharedLinks;
  }

  public addLink(url: string, title?: string, senderName?: string, avatarColor?: string, channel?: string) {
    const linkId = 'lnk_' + Math.random().toString(36).substring(2, 9);
    const newLink = {
      id: linkId,
      url: url.trim(),
      title: (title || '').trim() || url.trim(),
      senderName: senderName || 'Anonymous',
      avatarColor: avatarColor || '#10b981',
      timestamp: Date.now(),
      channel: channel || 'chatindian',
    };
    this.sharedLinks.unshift(newLink);
    if (this.sharedLinks.length > 50) this.sharedLinks.pop();

    this.clients.forEach((client) => {
      this.send(client, 'link_shared', { link: newLink });
    });
    return newLink;
  }

  private initDefaultGroups() {
    const defaultRooms: Omit<GroupRoom, 'userCount'>[] = [
      {
        id: 'general',
        name: '🌐 General Lounge',
        topic: 'Aapka Swagat Hai! Open chat room for everyone to hang out and talk.',
        category: 'Main',
        icon: 'MessageSquare',
      },
      {
        id: 'gaming',
        name: '🎮 Gaming & Esports',
        topic: 'BGMI, Valorant, FreeFire, GTA, PC & Mobile gaming discussions!',
        category: 'Gaming',
        icon: 'Gamepad2',
      },
      {
        id: 'music',
        name: '🎵 Music & Vibe',
        topic: 'Share song recommendations, playlists, acoustic covers, and vibe together.',
        category: 'Entertainment',
        icon: 'Music',
      },
      {
        id: 'tech',
        name: '💻 Tech & AI Hub',
        topic: 'Coding, smartphones, AI tools, startups & career chit-chat.',
        category: 'Tech',
        icon: 'Code',
      },
      {
        id: 'movies',
        name: '🎬 Movies & Binge',
        topic: 'Bollywood, Hollywood, Anime, Netflix shows & movie reviews.',
        category: 'Entertainment',
        icon: 'Film',
      },
      {
        id: 'hangout',
        name: '☕ Late Night Hangout',
        topic: 'Casual jokes, late night talks, storytelling & fun banters.',
        category: 'Social',
        icon: 'Coffee',
      },
      {
        id: 'friendship',
        name: '❤️ Friendship Corner',
        topic: 'Make new friends from everywhere in a safe and friendly space.',
        category: 'Social',
        icon: 'Heart',
      },
    ];

    defaultRooms.forEach((r) => {
      this.groups.set(r.id, {
        ...r,
        userCount: 0,
        members: new Set(),
        history: [],
      });
    });
  }

  private init() {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const socket = ws as ClientSocket;
      socket.id = 'usr_' + Math.random().toString(36).substring(2, 10);
      socket.username = 'User_' + Math.floor(1000 + Math.random() * 9000);
      socket.avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      socket.isAlive = true;
      socket.isSearching = false;

      this.clients.set(socket.id, socket);
      this.broadcastStats();

      // Send initial group list & profile info
      this.send(socket, 'profile_updated', {
        userId: socket.id,
        username: socket.username,
        avatarColor: socket.avatarColor,
      });
      this.sendGroupList(socket);

      socket.on('pong', () => {
        socket.isAlive = true;
      });

      socket.on('message', (data: string) => {
        try {
          const parsed = JSON.parse(data.toString());
          this.handleMessage(socket, parsed);
        } catch (e) {
          console.error('Invalid WS message payload:', e);
        }
      });

      socket.on('close', () => {
        this.handleDisconnect(socket);
      });

      socket.on('error', (err) => {
        console.error(`Socket error for ${socket.id}:`, err);
        this.handleDisconnect(socket);
      });
    });

    // Heartbeat ping/pong every 20s
    this.pingInterval = setInterval(() => {
      this.clients.forEach((socket) => {
        if (!socket.isAlive) {
          socket.terminate();
          this.handleDisconnect(socket);
          return;
        }
        socket.isAlive = false;
        socket.ping();
      });
    }, 20000);
  }

  private send(socket: ClientSocket, type: string, payload: Record<string, unknown> | object) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, ...payload }));
    }
  }

  private broadcastStats() {
    const onlineCount = this.clients.size;
    const searchingCount = this.queue.length;

    this.clients.forEach((socket) => {
      this.send(socket, 'stats', { onlineCount, searchingCount });
    });
  }

  private sendGroupList(targetSocket?: ClientSocket) {
    const groupList: GroupRoom[] = Array.from(this.groups.values())
      .filter((g) => !g.isCustom) // Only send public default rooms; custom rooms are invite-link only
      .map((g) => ({
        id: g.id,
        name: g.name,
        topic: g.topic,
        category: g.category,
        icon: g.icon,
        userCount: g.members.size,
        isCustom: g.isCustom,
      }));

    if (targetSocket) {
      this.send(targetSocket, 'group_list', { groups: groupList });
    } else {
      this.clients.forEach((socket) => {
        this.send(socket, 'group_list', { groups: groupList });
      });
    }
  }

  private handleMessage(socket: ClientSocket, data: { type: string; [key: string]: any }) {
    switch (data.type) {
      case 'set_profile': {
        if (data.userId && typeof data.userId === 'string' && data.userId.startsWith('usr_')) {
          if (socket.id !== data.userId) {
            this.clients.delete(socket.id);
            socket.id = data.userId;
            this.clients.set(socket.id, socket);
          }
        }
        if (data.username && typeof data.username === 'string') {
          const cleanName = data.username.trim().substring(0, 24) || socket.username;
          socket.username = cleanName;
        }
        if (data.avatarColor && typeof data.avatarColor === 'string') {
          socket.avatarColor = data.avatarColor;
        }
        this.send(socket, 'profile_updated', {
          userId: socket.id,
          username: socket.username,
          avatarColor: socket.avatarColor,
        });

        // If currently in a group room, update name in group
        if (socket.activeGroupId) {
          const group = this.groups.get(socket.activeGroupId);
          if (group) {
            this.broadcastToGroup(group, 'group_user_updated', {
              id: socket.id,
              username: socket.username,
              avatarColor: socket.avatarColor,
            });
          }
        }
        break;
      }

      case 'get_groups': {
        this.sendGroupList(socket);
        break;
      }

      case 'get_links': {
        this.send(socket, 'shared_links_list', { links: this.sharedLinks });
        break;
      }

      case 'share_link': {
        const url = (data.url || '').trim();
        if (!url) break;
        const title = (data.title || '').trim();
        const channel = (data.channel || 'chatindian').trim();
        this.addLink(url, title, socket.username, socket.avatarColor, channel);
        break;
      }

      case 'create_group': {
        const name = (data.name || '').trim().substring(0, 32);
        const topic = (data.topic || '').trim().substring(0, 80) || 'Private custom chatroom';
        const category = (data.category || 'Custom').trim();

        if (!name) return;

        // Generate clean unique alphanumeric ID (e.g. room_k9a2x7)
        const groupId = 'room_' + Math.random().toString(36).substring(2, 8);
        const newGroup: InternalGroupRoom = {
          id: groupId,
          name: name,
          topic: topic,
          category: category,
          icon: 'Users',
          userCount: 0,
          isCustom: true,
          members: new Set(),
          history: [],
        };

        this.groups.set(groupId, newGroup);

        // Notify the creator that room was successfully created
        this.send(socket, 'group_created', {
          groupId,
          name,
          topic,
          category,
        });

        // Auto join created group for the creator
        this.joinGroup(socket, groupId);
        break;
      }

      case 'join_group': {
        const groupId = data.groupId;
        if (groupId) {
          this.joinGroup(socket, groupId);
        }
        break;
      }

      case 'leave_group': {
        this.leaveActiveGroup(socket);
        break;
      }

      case 'send_group_message': {
        let groupId = socket.activeGroupId || data.groupId;
        if (!groupId) return;
        let group = this.groups.get(groupId);
        if (!group) return;

        // Auto attach socket to group if missing or mismatched
        if (socket.activeGroupId !== groupId) {
          socket.activeGroupId = groupId;
          group.members.add(socket);
        }

        const text = (data.text || '').trim();
        const mediaType = data.mediaType; // 'photo' | 'gif'
        const mediaUrl = data.mediaUrl;
        const ephemeralTimer = data.ephemeralTimer ? Number(data.ephemeralTimer) : undefined;

        if (!text && !mediaUrl) return;

        const message: GroupMessage = {
          id: data.id || ('gmsg_' + Math.random().toString(36).substring(2, 10)),
          groupId,
          senderId: socket.id,
          senderName: socket.username || 'Anonymous',
          text: text || (mediaType === 'gif' ? 'Sent a GIF' : 'Sent a Photo'),
          timestamp: data.timestamp || Date.now(),
          avatarColor: socket.avatarColor,
          mediaType,
          mediaUrl,
          ephemeralTimer,
        };

        // Push to ephemeral history (max 50)
        group.history.push(message);
        if (group.history.length > 50) {
          group.history.shift();
        }

        // Clean expired media from history (older than 10 min)
        const tenMinsAgo = Date.now() - 10 * 60 * 1000;
        group.history.forEach((m) => {
          if (m.mediaUrl && m.timestamp < tenMinsAgo) {
            delete m.mediaUrl;
            m.isExpired = true;
          }
        });

        this.broadcastToGroup(group, 'group_message', { message });
        break;
      }

      case 'group_typing': {
        let groupId = socket.activeGroupId || data.groupId;
        if (!groupId) return;
        const group = this.groups.get(groupId);
        if (!group) return;

        this.broadcastToGroup(group, 'group_typing', {
          userId: socket.id,
          username: socket.username,
          isTyping: !!data.isTyping,
        }, socket); // exclude self
        break;
      }

      // Direct Private Messaging (DM)
      case 'send_dm': {
        const targetUserId = data.targetUserId;
        const text = (data.text || '').trim();
        const mediaType = data.mediaType; // 'photo' | 'gif'
        const mediaUrl = data.mediaUrl;
        const ephemeralTimer = data.ephemeralTimer ? Number(data.ephemeralTimer) : undefined;

        if (!targetUserId || (!text && !mediaUrl)) return;

        const msgId = data.id || ('dm_' + Math.random().toString(36).substring(2, 10));
        const timestamp = data.timestamp || Date.now();

        const dmMsg: any = {
          id: msgId,
          senderId: socket.id,
          senderName: socket.username || 'Anonymous',
          avatarColor: socket.avatarColor,
          targetUserId: targetUserId,
          text: text || (mediaType === 'gif' ? 'Sent a GIF' : 'Sent a Photo'),
          timestamp,
          mediaType,
          mediaUrl,
          ephemeralTimer,
        };

        // Cache in dmHistory
        const pairKey = [socket.id, targetUserId].sort().join(':');
        const history = this.dmHistory.get(pairKey) || [];
        if (!history.some((m) => m.id === dmMsg.id)) {
          history.push(dmMsg);
          if (history.length > 100) history.shift();

          // Auto purge photos older than 10 mins from server history to save RAM
          const tenMinsAgo = Date.now() - 10 * 60 * 1000;
          history.forEach((m) => {
            if (m.mediaUrl && m.timestamp < tenMinsAgo) {
              delete m.mediaUrl;
              m.isExpired = true;
            }
          });

          this.dmHistory.set(pairKey, history);
        }

        const targetSocket = this.clients.get(targetUserId);
        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          this.send(targetSocket, 'dm_received', { message: dmMsg });
        }

        // Echo back to sender
        this.send(socket, 'dm_sent', { message: dmMsg });
        break;
      }

      case 'get_dm_history': {
        const targetUserId = data.targetUserId;
        if (!targetUserId) return;
        const pairKey = [socket.id, targetUserId].sort().join(':');
        const history = this.dmHistory.get(pairKey) || [];
        this.send(socket, 'dm_history', {
          targetUserId,
          history,
        });
        break;
      }

      case 'dm_signal': {
        const targetUserId = data.targetUserId;
        const signal = data.signal;
        if (!targetUserId || !signal) return;

        const targetSocket = this.clients.get(targetUserId);
        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          this.send(targetSocket, 'dm_signal', {
            senderId: socket.id,
            senderName: socket.username || 'Anonymous',
            avatarColor: socket.avatarColor,
            signal,
          });
        }
        break;
      }

      // 1-on-1 Stranger Chat events
      case 'join_queue': {
        this.leaveCurrentRoom(socket);
        this.leaveActiveGroup(socket);
        this.removeFromQueue(socket);

        socket.interests = Array.isArray(data.interests) ? data.interests : [];
        socket.blockedPeerIds = Array.isArray(data.blockedPeerIds) ? data.blockedPeerIds : [];
        socket.isSearching = true;

        this.queue.push(socket);
        this.tryMatchmaking();
        this.broadcastStats();
        break;
      }

      case 'leave_queue': {
        this.removeFromQueue(socket);
        this.broadcastStats();
        break;
      }

      case 'leave_room': {
        this.leaveCurrentRoom(socket);
        if (data.next) {
          socket.isSearching = true;
          this.queue.push(socket);
          this.tryMatchmaking();
        }
        this.broadcastStats();
        break;
      }

      case 'signal': {
        if (!socket.roomId) return;
        const room = this.rooms.get(socket.roomId);
        if (!room) return;

        const peer = room.peerA.id === socket.id ? room.peerB : room.peerA;
        this.send(peer, 'signal', { signal: data.signal });
        break;
      }

      case 'relay_message': {
        if (!socket.roomId) return;
        const room = this.rooms.get(socket.roomId);
        if (!room) return;

        const peer = room.peerA.id === socket.id ? room.peerB : room.peerA;
        this.send(peer, 'relay_message', {
          id: data.id,
          text: data.text,
          mediaType: data.mediaType,
          mediaUrl: data.mediaUrl,
          ephemeralTimer: data.ephemeralTimer,
          timestamp: data.timestamp || Date.now(),
        });
        break;
      }

      case 'typing': {
        if (!socket.roomId) return;
        const room = this.rooms.get(socket.roomId);
        if (!room) return;

        const peer = room.peerA.id === socket.id ? room.peerB : room.peerA;
        this.send(peer, 'typing', { isTyping: !!data.isTyping });
        break;
      }

      case 'report_stranger': {
        if (!socket.roomId) return;
        const room = this.rooms.get(socket.roomId);
        if (!room) return;

        const peer = room.peerA.id === socket.id ? room.peerB : room.peerA;
        this.send(peer, 'peer_left', { reason: 'reported' });
        this.send(socket, 'system_notice', { message: 'Report submitted. Stranger blocked.' });

        if (!socket.blockedPeerIds) socket.blockedPeerIds = [];
        socket.blockedPeerIds.push(peer.id);

        this.leaveCurrentRoom(socket);
        if (data.autoNext) {
          socket.isSearching = true;
          this.queue.push(socket);
          this.tryMatchmaking();
        }
        this.broadcastStats();
        break;
      }

      default:
        break;
    }
  }

  private joinGroup(socket: ClientSocket, groupId: string) {
    const group = this.groups.get(groupId);
    if (!group) {
      this.send(socket, 'group_error', {
        message: 'Chatroom not found or link has expired. Check your invite code or create a new room.',
        groupId,
      });
      return;
    }

    // Leave any existing active group first if switching rooms
    if (socket.activeGroupId && socket.activeGroupId !== groupId) {
      this.leaveActiveGroup(socket);
    }

    socket.activeGroupId = groupId;
    group.members.add(socket);

    // Prepare active users list in this group
    const activeUsers: GroupUser[] = Array.from(group.members).map((s) => ({
      id: s.id,
      username: s.username,
      avatarColor: s.avatarColor,
      joinedAt: Date.now(),
    }));

    // Send confirmation to user with room info & history
    this.send(socket, 'group_joined', {
      group: {
        id: group.id,
        name: group.name,
        topic: group.topic,
        category: group.category,
        icon: group.icon,
        userCount: group.members.size,
        isCustom: group.isCustom,
      },
      users: activeUsers,
      history: group.history,
    });

    // Notify other members in the group
    this.broadcastToGroup(group, 'group_user_joined', {
      user: {
        id: socket.id,
        username: socket.username,
        avatarColor: socket.avatarColor,
        joinedAt: Date.now(),
      },
    }, socket);

    // Add a system join message into group history
    const sysMsg: GroupMessage = {
      id: 'sys_' + Math.random().toString(36).substring(2, 10),
      groupId,
      senderId: 'system',
      senderName: 'System',
      text: `👋 ${socket.username} joined the chat room.`,
      timestamp: Date.now(),
      isSystem: true,
    };
    this.broadcastToGroup(group, 'group_message', { message: sysMsg });

    // Update global group user counts for everyone
    this.sendGroupList();
  }

  private leaveActiveGroup(socket: ClientSocket) {
    if (!socket.activeGroupId) return;

    const groupId = socket.activeGroupId;
    const group = this.groups.get(groupId);

    if (group) {
      group.members.delete(socket);

      // System left notification
      const sysMsg: GroupMessage = {
        id: 'sys_' + Math.random().toString(36).substring(2, 10),
        groupId,
        senderId: 'system',
        senderName: 'System',
        text: `🚪 ${socket.username} left the chat room.`,
        timestamp: Date.now(),
        isSystem: true,
      };
      this.broadcastToGroup(group, 'group_message', { message: sysMsg });

      this.broadcastToGroup(group, 'group_user_left', {
        userId: socket.id,
        username: socket.username,
      });
    }

    socket.activeGroupId = undefined;
    this.send(socket, 'group_left', { groupId });
    this.sendGroupList();
  }

  private broadcastToGroup(
    group: InternalGroupRoom,
    type: string,
    payload: Record<string, unknown> | object,
    excludeSocket?: ClientSocket
  ) {
    group.members.forEach((socket) => {
      if (socket.readyState !== WebSocket.OPEN) {
        group.members.delete(socket);
        return;
      }
      if (excludeSocket && socket.id === excludeSocket.id) return;
      this.send(socket, type, payload);
    });
  }

  private tryMatchmaking() {
    if (this.queue.length < 2) return;

    for (let i = 0; i < this.queue.length; i++) {
      const peerA = this.queue[i];
      if (!peerA || peerA.readyState !== WebSocket.OPEN) continue;

      for (let j = i + 1; j < this.queue.length; j++) {
        const peerB = this.queue[j];
        if (!peerB || peerB.readyState !== WebSocket.OPEN) continue;

        const aBlockedB = peerA.blockedPeerIds?.includes(peerB.id);
        const bBlockedA = peerB.blockedPeerIds?.includes(peerA.id);

        if (aBlockedB || bBlockedA) continue;

        this.queue.splice(j, 1);
        this.queue.splice(i, 1);

        peerA.isSearching = false;
        peerB.isSearching = false;

        const roomId = 'room_' + Math.random().toString(36).substring(2, 12);

        peerA.roomId = roomId;
        peerB.roomId = roomId;

        const room: Room = {
          id: roomId,
          peerA,
          peerB,
          createdAt: Date.now(),
        };

        this.rooms.set(roomId, room);

        this.send(peerA, 'matched', {
          roomId,
          role: 'initiator',
          peerId: peerB.id,
        });

        this.send(peerB, 'matched', {
          roomId,
          role: 'receiver',
          peerId: peerA.id,
        });

        this.tryMatchmaking();
        return;
      }
    }
  }

  private leaveCurrentRoom(socket: ClientSocket) {
    if (!socket.roomId) return;

    const roomId = socket.roomId;
    const room = this.rooms.get(roomId);

    if (room) {
      const peer = room.peerA.id === socket.id ? room.peerB : room.peerA;
      if (peer) {
        peer.roomId = undefined;
        this.send(peer, 'peer_left', { reason: 'stranger_left' });
      }
      this.rooms.delete(roomId);
    }

    socket.roomId = undefined;
  }

  private removeFromQueue(socket: ClientSocket) {
    socket.isSearching = false;
    this.queue = this.queue.filter((s) => s.id !== socket.id);
  }

  private handleDisconnect(socket: ClientSocket) {
    this.leaveActiveGroup(socket);
    this.leaveCurrentRoom(socket);
    this.removeFromQueue(socket);
    this.clients.delete(socket.id);
    this.broadcastStats();
  }

  public close() {
    if (this.pingInterval) clearInterval(this.pingInterval);
  }
}
