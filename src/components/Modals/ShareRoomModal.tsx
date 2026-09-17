import React, { useState } from 'react';
import {
  X,
  Link,
  Copy,
  Check,
  Share2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const ShareRoomModal: React.FC = () => {
  const { shareRoomData, activeGroup, setActiveModal, setShareRoomData } = useChat();
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const targetRoom = shareRoomData || (activeGroup ? {
    id: activeGroup.id,
    name: activeGroup.name,
    topic: activeGroup.topic,
    isCustom: activeGroup.isCustom,
  } : null);

  if (!targetRoom) return null;

  // Build full canonical invite URL
  const baseUrl = window.location.origin + window.location.pathname;
  const inviteUrl = `${baseUrl}?room=${encodeURIComponent(targetRoom.id)}`;
  const roomCode = targetRoom.id;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = inviteUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(roomCode);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = roomCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy code:', e);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Join my private chatroom "${targetRoom.name}" on ChatIndian! 🚀\nClick the link to join instantly: ${inviteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join "${targetRoom.name}" on ChatIndian`,
          text: `Join my private live chatroom on ChatIndian without login:`,
          url: inviteUrl,
        });
      } catch (e) {
        /* ignore cancel */
      }
    } else {
      handleCopyLink();
    }
  };

  const handleClose = () => {
    setShareRoomData(null);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Share Chatroom Link</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold uppercase">
                  Private
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Only people with this link can join
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Room Summary Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {targetRoom.name}
              </h3>
            </div>
            {targetRoom.topic && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {targetRoom.topic}
              </p>
            )}
            <div className="pt-1.5 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>Room Code:</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                title="Click to copy room code"
              >
                <span>{roomCode}</span>
                {codeCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Direct Link Copy Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-indigo-500" /> Direct Invite Link
              </span>
              {copied && (
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> Copied to Clipboard!
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono select-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 1-Click Share Actions */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Share With Friends
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                </svg>
                <span>Share WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>More Options</span>
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
            <p className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              Private & Isolated Room
            </p>
            <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              This chatroom is not listed on the public main screen. Only people who open your invite link or enter the room code can participate.
            </p>
          </div>

          {/* Bottom Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Continue to Chat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
