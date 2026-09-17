import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Smile,
  Info,
  ShieldAlert,
  ShieldCheck,
  Image as ImageIcon,
  Flame,
  Lock,
  Trash2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { ActionControls } from './ActionControls';
import { MediaPickerModal } from './Media/MediaPickerModal';
import { MediaBubble } from './Media/MediaBubble';

const EMOJI_LIST = ['👋', '😊', '😂', '🔥', '❤️', '💡', '🚀', '💯', '👍', '🤔', '🎉', '👏', '⚡', '✨'];

export const ChatInterface: React.FC = () => {
  const {
    connectionStatus,
    messages,
    strangerIsTyping,
    sendMessage,
    sendTyping,
    setActiveModal,
    expireChatMessageMedia,
    screenshotProtection,
    clearChat,
  } = useChat();

  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, strangerIsTyping]);

  // Focus input on load
  useEffect(() => {
    if (connectionStatus === 'connected') {
      inputRef.current?.focus();
    }
  }, [connectionStatus]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || connectionStatus !== 'connected') return;

    sendMessage(input);
    setInput('');
    sendTyping(false);
    setShowEmojis(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    sendTyping(e.target.value.length > 0);
  };

  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleSendMedia = (payload: {
    mediaType: 'photo' | 'gif';
    mediaUrl: string;
    caption?: string;
    ephemeralTimer?: number;
  }) => {
    sendMessage(payload.caption || '', {
      mediaType: payload.mediaType,
      mediaUrl: payload.mediaUrl,
      ephemeralTimer: payload.ephemeralTimer,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden protected-chat-content">
      
      {/* Top Chat Status Header */}
      <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Stranger</span>
              {strangerIsTyping && (
                <span className="text-xs font-normal text-indigo-600 dark:text-indigo-400 animate-pulse">
                  is typing...
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {connectionStatus === 'connected' ? 'Connected & Active (P2P Encrypted)' : 'Disconnected'}
            </p>
          </div>
        </div>

        {/* Security & Safety Badges */}
        <div className="flex items-center gap-2">
          {/* Clear Chat Button */}
          <button
            id="clear-chat-interface-button"
            type="button"
            onClick={clearChat}
            disabled={messages.length === 0}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Clear Chat - Remove all current local message history from the display"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>

          {screenshotProtection && (
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold"
              title="Anti-Screenshot protection active: Screen captures and recording are shielded"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Anti-Screenshot Shield</span>
            </div>
          )}

          <button
            onClick={() => setActiveModal('safety')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safety Tips</span>
          </button>
        </div>
      </div>

      {/* Ephemeral Privacy Banner */}
      <div className="px-4 py-1.5 bg-indigo-500/5 border-b border-indigo-500/10 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <Lock className="w-3 h-3 text-indigo-500 shrink-0" />
          <span className="truncate">Telegram Privacy: Send self-destructing photos with custom countdown timers.</span>
        </div>
        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 uppercase tracking-wider">
          E2EE & Ephemeral
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium text-center max-w-md border border-zinc-300/50 dark:border-zinc-700/50 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          const isYou = msg.sender === 'you';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isYou ? 'items-end' : 'items-start'} space-y-1`}
            >
              <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 px-1">
                {isYou ? 'You' : 'Stranger'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              <div
                className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-sm overflow-hidden ${
                  isYou
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-zinc-200 dark:border-zinc-700'
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
                      isMine={isYou}
                      isExpired={msg.isExpired}
                      onExpire={() => {
                        expireChatMessageMedia(msg.id);
                      }}
                    />
                  </div>
                ) : null}

                {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {strangerIsTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker Popup */}
      {showEmojis && (
        <div className="p-2.5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-1.5 justify-center animate-in fade-in duration-150">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="p-2.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Insert Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Photo & GIF Attachment Button */}
        <button
          type="button"
          disabled={connectionStatus !== 'connected'}
          onClick={() => setShowMediaPicker(true)}
          className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1 shrink-0 font-bold text-xs disabled:opacity-40"
          title="Send Photo or GIF with Self-Destruct Timer"
        >
          <ImageIcon className="w-4 h-4" />
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline text-[11px] font-semibold">Photo/GIF</span>
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          disabled={connectionStatus !== 'connected'}
          placeholder={
            connectionStatus === 'connected'
              ? 'Type a message... (Press Enter to send, Esc for Next Stranger)'
              : 'Stranger disconnected. Click "Next Stranger" to continue.'
          }
          className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent dark:border-zinc-700/50 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || connectionStatus !== 'connected'}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      {/* Control Buttons Footer */}
      <ActionControls />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSendMedia={handleSendMedia}
        title="Send Media to Stranger"
      />

    </div>
  );
};
