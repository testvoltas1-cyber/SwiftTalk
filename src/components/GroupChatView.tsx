import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Send,
  Smile,
  LogOut,
  MessageCircle,
  Sparkles,
  UserCheck,
  X,
  Volume2,
  VolumeX,
  Pin,
  PinOff,
  UserPlus,
  Share2,
  Image as ImageIcon,
  Flame,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { MediaPickerModal } from './Media/MediaPickerModal';
import { MediaBubble } from './Media/MediaBubble';

const QUICK_EMOJIS = ['😃', '😂', '🔥', '❤️', '👍', '🎉', '🎮', '🎵', '🚀', '💡', '💯', '👏', '🤝', '⚡'];

export const GroupChatView: React.FC = () => {
  const {
    activeGroup,
    groupUsers,
    groupMessages,
    typingGroupUsers,
    leaveGroupRoom,
    sendGroupMessage,
    sendGroupTyping,
    tempUsername,
    avatarColor,
    myUserId,
    preferences,
    updatePreferences,
    setActiveModal,
    openDirectMessage,
    pinnedUsers,
    unpinUser,
    togglePinUser,
    isUserPinned,
    openShareModal,
    expireGroupMessageMedia,
    screenshotProtection,
    clearGroupMessages,
  } = useChat();

  const [input, setInput] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Total unread count from pinned DMs
  const totalUnreadDms = pinnedUsers.reduce((acc, u) => acc + (u.unreadCount || 0), 0);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages, typingGroupUsers]);

  if (!activeGroup) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    sendGroupTyping(true);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      sendGroupTyping(false);
    }, 2000);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    sendGroupMessage(input);
    setInput('');
    setShowEmojiPicker(false);
    sendGroupTyping(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMedia = (payload: {
    mediaType: 'photo' | 'gif';
    mediaUrl: string;
    caption?: string;
    ephemeralTimer?: number;
  }) => {
    sendGroupMessage(payload.caption || '', {
      mediaType: payload.mediaType,
      mediaUrl: payload.mediaUrl,
      ephemeralTimer: payload.ephemeralTimer,
    });
  };

  // Helper to check if a user is currently online in the group
  const isUserOnlineInRoom = (userId: string) => {
    return groupUsers.some((u) => u.id === userId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 h-[calc(100vh-5rem)] flex flex-col">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 shadow-sm flex items-center justify-between gap-3 shrink-0">
        
        {/* Left: Back button & Room Details */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={leaveGroupRoom}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors shrink-0"
            title="Leave Chatroom"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {activeGroup.name}
              </h2>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                {activeGroup.category}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-md">
              {activeGroup.topic}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Sound Toggle */}
          <button
            onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            title={preferences.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {preferences.soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear Chat Button */}
          <button
            id="group-clear-chat-button"
            type="button"
            onClick={clearGroupMessages}
            disabled={groupMessages.length === 0}
            className="px-2.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-zinc-200 dark:border-zinc-700 transition-colors text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Clear Chat - Remove all messages from display"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          {/* Share / Invite Link Button */}
          <button
            onClick={() => openShareModal()}
            className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-xs"
            title="Share Room Invite Link"
          >
            <Share2 className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Share Link</span>
          </button>

          {/* Dedicated Private DM Button with Glow and Ping Badge */}
          <button
            onClick={() => setActiveModal('private_dms')}
            className={`relative px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
              totalUnreadDms > 0
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-400 shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-400 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 animate-pulse'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Open Private DMs Inbox"
          >
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
              {totalUnreadDms > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-extrabold">Private DM</span>
            {totalUnreadDms > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs">
                {totalUnreadDms}
              </span>
            ) : pinnedUsers.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/15 dark:bg-indigo-400/20 text-[10px] font-bold">
                {pinnedUsers.length}
              </span>
            ) : null}
          </button>

          {/* Online Members & Pinned DMs Sidebar Toggle */}
          <button
            onClick={() => setShowMembers(!showMembers)}
            className={`relative px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showMembers
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : totalUnreadDms > 0
                ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-400'
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Toggle Members & Private DMs Sidebar"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">{groupUsers.length} Online</span>
            <span className="sm:hidden">{groupUsers.length}</span>
            {totalUnreadDms > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 text-white text-[8px] font-black items-center justify-center">
                  !
                </span>
              </span>
            )}
          </button>

          {/* Leave Room Button */}
          <button
            onClick={leaveGroupRoom}
            className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>

      </div>

      {/* Main Chat Body & Online Users Sidebar */}
      <div className="relative flex-1 mt-3 flex gap-4 min-h-0 overflow-hidden">
        
        {/* Messages Feed Area */}
        <div className="flex-1 bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col min-h-0 overflow-hidden">
          
          {/* Scrollable Message History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            
            {/* Room Welcome Banner */}
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center space-y-1.5 max-w-lg mx-auto my-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Welcome to {activeGroup.name}!
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                You are chatting as <span className="font-semibold text-indigo-600 dark:text-indigo-400">{tempUsername}</span>. Click on any user to start a private DM and pin them to your favorites!
              </p>
            </div>

            {/* Render Messages */}
            {groupMessages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-500 dark:text-zinc-400 text-[11px] font-medium">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMe = Boolean(myUserId && msg.senderId === myUserId);

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[88%] sm:max-w-[78%] group ${
                    isMe ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Sender Avatar */}
                  <button
                    type="button"
                    disabled={isMe}
                    onClick={() => {
                      if (!isMe) {
                        openDirectMessage({
                          id: msg.senderId,
                          username: msg.senderName,
                          avatarColor: msg.avatarColor || '#6366f1',
                        });
                      }
                    }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm mt-0.5 transition-transform ${
                      !isMe ? 'hover:scale-110 cursor-pointer' : ''
                    }`}
                    style={{ backgroundColor: msg.avatarColor || '#6366f1' }}
                    title={!isMe ? `Click to DM & Favorite ${msg.senderName}` : undefined}
                  >
                    {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : '?'}
                  </button>

                  {/* Message Content Bubble */}
                  <div className={`space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className="flex items-center gap-2 px-1 text-[11px]">
                      {isMe ? (
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">You</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              openDirectMessage({
                                id: msg.senderId,
                                username: msg.senderName,
                                avatarColor: msg.avatarColor || '#6366f1',
                              })
                            }
                            className="font-bold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                            title={`Click to DM ${msg.senderName}`}
                          >
                            <span>{msg.senderName}</span>
                          </button>

                          {/* Quick DM Button on Message Header */}
                          <button
                            type="button"
                            onClick={() =>
                              openDirectMessage({
                                id: msg.senderId,
                                username: msg.senderName,
                                avatarColor: msg.avatarColor || '#6366f1',
                              })
                            }
                            className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                            title={`Send direct message to ${msg.senderName}`}
                          >
                            <MessageCircle className="w-2.5 h-2.5" />
                            <span>DM</span>
                          </button>
                        </div>
                      )}
                      <span className="text-zinc-400 dark:text-zinc-500 text-[10px]">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-xs overflow-hidden ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/60 dark:border-zinc-700/50'
                      }`}
                    >
                      {/* Media Bubble */}
                      {msg.mediaUrl || msg.isExpired ? (
                        <div className="mb-2">
                          <MediaBubble
                            mediaType={msg.mediaType}
                            mediaUrl={msg.mediaUrl}
                            ephemeralTimer={msg.ephemeralTimer}
                            timestamp={msg.timestamp}
                            isMine={isMe}
                            isExpired={msg.isExpired}
                            onExpire={() => {
                              expireGroupMessageMedia(msg.id);
                            }}
                          />
                        </div>
                      ) : null}

                      {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator Bar */}
          {typingGroupUsers.length > 0 && (
            <div className="px-4 py-1.5 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              </span>
              <span>
                {typingGroupUsers.join(', ')} {typingGroupUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}

          {/* Input & Controls Section */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800 space-y-2 shrink-0">
            
            {/* Quick Reactions bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500 shrink-0 mr-1">
                Quick:
              </span>
              {['👋 Hello!', '🔥 Vibe!', '😂 LOL', '👍 Agreed', '🎮 Let\'s play!', '💯 Awesome'].map((quick) => (
                <button
                  key={quick}
                  onClick={() => sendGroupMessage(quick)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium whitespace-nowrap transition-colors"
                >
                  {quick}
                </button>
              ))}
            </div>

            {/* Text Input Form */}
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              
              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-14 left-0 z-20 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 grid grid-cols-7 gap-2 animate-in fade-in duration-150">
                  {QUICK_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => handleAddEmoji(e)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-lg transition-transform hover:scale-110"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shrink-0"
                title="Choose Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Photo & GIF Attachment Button */}
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-1.5 shrink-0 font-bold text-xs shadow-xs"
                title="Send Photo or GIF with Telegram Self-Destruct Timer"
              >
                <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-[11px] font-bold">Photo/GIF</span>
              </button>

              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={`Message #${activeGroup.name} as ${tempUsername}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center shrink-0 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

        {/* Mobile Backdrop Overlay when sidebar is open */}
        {showMembers && (
          <div
            onClick={() => setShowMembers(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          />
        )}

        {/* Members & Pinned DMs Sidebar */}
        <div
          className={`bg-white dark:bg-zinc-900 p-4 shadow-xl md:shadow-sm flex flex-col shrink-0 transition-all ${
            showMembers
              ? 'fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] border-l border-zinc-200 dark:border-zinc-800 flex rounded-none'
              : 'hidden md:flex md:w-72 md:rounded-2xl md:border md:border-zinc-200 md:dark:border-zinc-800'
          }`}
        >
          {/* Sidebar Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <MessageCircle className={`w-4 h-4 ${totalUnreadDms > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500'}`} />
                {totalUnreadDms > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                )}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Private DMs & Members
              </h3>
            </div>
            <button
              onClick={() => setShowMembers(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 space-y-4 divide-y divide-zinc-100 dark:divide-zinc-800/80">
            
            {/* Invite Friends Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => openShareModal()}
                className="w-full p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center justify-between text-xs font-bold transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-500" />
                  <span>Invite Friends Link</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 px-2 py-0.5 rounded-md text-indigo-700 dark:text-indigo-300">
                  Share
                </span>
              </button>
            </div>

            {/* Section 1: Private DMs (Saved Conversations) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  totalUnreadDms > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-600/80 dark:text-indigo-400/80'
                }`}>
                  <div className="relative flex items-center justify-center">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {totalUnreadDms > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                      </span>
                    )}
                  </div>
                  <span>Private DMs ({pinnedUsers.length})</span>
                </span>
                {totalUnreadDms > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold shadow-xs animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>{totalUnreadDms} new</span>
                  </span>
                )}
              </div>

              {pinnedUsers.length === 0 ? (
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-dashed border-zinc-200 dark:border-zinc-700/60 text-center space-y-1">
                  <UserPlus className="w-5 h-5 text-zinc-400 mx-auto" />
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                    No private DMs yet. Click <span className="font-semibold text-indigo-500">DM</span> on any user to chat privately and save them here!
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {pinnedUsers.map((pinned) => {
                    const isOnline = isUserOnlineInRoom(pinned.id);
                    return (
                      <div
                        key={pinned.id}
                        onClick={() => {
                          openDirectMessage({
                            id: pinned.id,
                            username: pinned.username,
                            avatarColor: pinned.avatarColor || '#6366f1',
                          });
                        }}
                        className="group flex items-center justify-between p-2 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/5 dark:hover:bg-amber-500/10 border border-amber-500/15 hover:border-amber-500/30 cursor-pointer transition-all"
                        title={`Click to open DM with ${pinned.username}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                              style={{ backgroundColor: pinned.avatarColor || '#6366f1' }}
                            >
                              {pinned.username ? pinned.username.charAt(0).toUpperCase() : '?'}
                            </div>
                            {isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {pinned.username}
                              </p>
                              {pinned.unreadCount && pinned.unreadCount > 0 ? (
                                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-extrabold animate-pulse">
                                  {pinned.unreadCount}
                                </span>
                              ) : null}
                            </div>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate max-w-[120px]">
                              {pinned.lastMessage ? pinned.lastMessage : (isOnline ? 'Online now' : 'Pinned contact')}
                            </p>
                          </div>
                        </div>

                        {/* Remove / Cross Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            unpinUser(pinned.id);
                          }}
                          className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-70 group-hover:opacity-100 transition-all shrink-0"
                          title="Remove from favorites"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 2: Room Live Members */}
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-indigo-500" />
                  <span>Live Members ({groupUsers.length})</span>
                </span>
              </div>

              <div className="space-y-1.5">
                {groupUsers.map((user) => {
                  const isMe = Boolean(myUserId && user.id === myUserId);
                  const isPinned = isUserPinned(user.id);

                  return (
                    <div
                      key={user.id}
                      onClick={() => {
                        if (!isMe) {
                          openDirectMessage({
                            id: user.id,
                            username: user.username,
                            avatarColor: user.avatarColor || '#6366f1',
                          });
                        }
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                        isMe
                          ? 'bg-indigo-500/10 border border-indigo-500/20'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer group'
                      }`}
                      title={!isMe ? `Click to DM ${user.username}` : undefined}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                            style={{ backgroundColor: user.avatarColor || '#6366f1' }}
                          >
                            {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {user.username}
                          </p>
                          <span className="text-[10px] text-emerald-500 font-semibold block">
                            Active in room
                          </span>
                        </div>
                      </div>

                      {isMe ? (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-extrabold uppercase shrink-0">
                          You
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          {/* Quick Pin / Unpin button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinUser({
                                id: user.id,
                                username: user.username,
                                avatarColor: user.avatarColor,
                              });
                            }}
                            className={`p-1 rounded-lg transition-colors ${
                              isPinned
                                ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20'
                                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                            title={isPinned ? 'Remove from favorites' : 'Pin to favorites'}
                          >
                            {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                          </button>

                          {/* Direct Message trigger */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDirectMessage({
                                id: user.id,
                                username: user.username,
                                avatarColor: user.avatarColor || '#6366f1',
                              });
                            }}
                            className="px-2 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-[10px] font-bold transition-all shrink-0 flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>DM</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Change Temp Username Quick Link */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveModal('username')}
              className="w-full py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Change Username</span>
            </button>
          </div>

        </div>

      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSendMedia={handleSendMedia}
        title={`Send Media to #${activeGroup.name}`}
      />

    </div>
  );
};
