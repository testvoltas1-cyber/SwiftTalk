import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Smile,
  ShieldCheck,
  MessageCircle,
  Pin,
  PinOff,
  Image as ImageIcon,
  Flame,
  Film,
  Lock,
  Trash2,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { MediaPickerModal } from '../Media/MediaPickerModal';
import { MediaBubble } from '../Media/MediaBubble';

const QUICK_EMOJIS = ['😃', '😂', '🔥', '❤️', '👍', '🎉', '👋', '💯'];

export const DirectMessageModal: React.FC = () => {
  const {
    activeDmUser,
    closeDirectMessage,
    directMessages,
    sendDirectMessage,
    isDmWebRtcConnected,
    myUserId,
    togglePinUser,
    isUserPinned,
    expireDirectMessageMedia,
    screenshotProtection,
    clearDirectMessages,
  } = useChat();

  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messages = activeDmUser ? directMessages[activeDmUser.id] || [] : [];
  const isWebRtcDirect = activeDmUser ? isDmWebRtcConnected(activeDmUser.id) : false;
  const isPinned = activeDmUser ? isUserPinned(activeDmUser.id) : false;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeDmUser) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    sendDirectMessage(input);
    setInput('');
    setShowEmojiPicker(false);
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
    sendDirectMessage(payload.caption || '', {
      mediaType: payload.mediaType,
      mediaUrl: payload.mediaUrl,
      ephemeralTimer: payload.ephemeralTimer,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-[560px] max-h-[92vh] overflow-hidden protected-chat-content">
        
        {/* Header */}
        <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Target Avatar */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
              style={{ backgroundColor: activeDmUser.avatarColor || '#6366f1' }}
            >
              {activeDmUser.username ? activeDmUser.username.charAt(0).toUpperCase() : '?'}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {activeDmUser.username}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold tracking-wider uppercase">
                  Private DM
                </span>
              </div>
              <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isWebRtcDirect ? 'P2P Encrypted (WebRTC)' : 'Relay Protected'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Screenshot Protection Pill */}
            {screenshotProtection && (
              <div
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold"
                title="Screenshots & screen captures are blocked for private chat safety"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Anti-Screenshot On</span>
              </div>
            )}

            {/* Clear Chat Button */}
            <button
              id="dm-clear-chat-button"
              type="button"
              onClick={() => clearDirectMessages(activeDmUser.id)}
              disabled={messages.length === 0}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Clear Chat - Remove all messages from display"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Favorite / Pin Toggle */}
            <button
              onClick={() => togglePinUser(activeDmUser)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                isPinned
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title={isPinned ? 'Remove from Favorite DMs' : 'Add to Favorite DMs'}
            >
              {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            </button>

            <button
              onClick={closeDirectMessage}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Close Private Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telegram Privacy Sub-Header */}
        <div className="px-4 py-1.5 bg-indigo-500/5 border-b border-indigo-500/10 text-[10.5px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <Lock className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="truncate">E2EE Protected • Photos auto-delete after 10m / custom timer</span>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
            Telegram Security
          </span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-zinc-400">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Start a private chat with {activeDmUser.username}!
              </p>
              <p className="text-[11px] text-zinc-400 max-w-xs">
                You can send encrypted texts, GIFs, and self-destructing photos with Telegram-style security.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = Boolean(msg.isMine || (myUserId && msg.senderId === myUserId));

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-1 px-1">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`rounded-2xl text-xs max-w-[85%] break-words shadow-xs overflow-hidden ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-tr-xs p-3'
                        : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-xs border border-zinc-200 dark:border-zinc-700/60 p-3'
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
                            if (activeDmUser) {
                              expireDirectMessageMedia(activeDmUser.id, msg.id);
                            }
                          }}
                        />
                      </div>
                    ) : null}

                    {/* Text Message */}
                    {msg.text && (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reactions */}
        <div className="px-3 py-1.5 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-zinc-400 uppercase mr-1 shrink-0">Quick:</span>
          {['👋 Hi!', '🔥 Nice!', '😂 Haha', '❤️ Cool', '👍 Ok'].map((q) => (
            <button
              key={q}
              onClick={() => {
                sendDirectMessage(q);
              }}
              className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} className="relative p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 shrink-0">
          
          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-3 z-20 p-2.5 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 grid grid-cols-4 gap-2 animate-in fade-in duration-150">
              {QUICK_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => handleAddEmoji(e)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-base"
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Photo & GIF Attachment Button */}
          <button
            type="button"
            onClick={() => setShowMediaPicker(true)}
            className="px-2.5 py-1.5 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-1 font-bold text-xs shadow-xs shrink-0"
            title="Send Photo or GIF with Self-Destruct Timer"
          >
            <ImageIcon className="w-4 h-4" />
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline text-[10px] font-bold">Photo/GIF</span>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${activeDmUser.username}...`}
            className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSendMedia={handleSendMedia}
        title={`Send Media to ${activeDmUser.username}`}
      />
    </div>
  );
};
