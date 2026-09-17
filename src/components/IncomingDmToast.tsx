import React, { useEffect } from 'react';
import { MessageCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const IncomingDmToast: React.FC = () => {
  const { incomingDmToast, clearIncomingDmToast, openDirectMessage } = useChat();

  useEffect(() => {
    if (!incomingDmToast) return;

    const timer = setTimeout(() => {
      clearIncomingDmToast();
    }, 7000);

    return () => clearTimeout(timer);
  }, [incomingDmToast, clearIncomingDmToast]);

  if (!incomingDmToast) return null;

  const handleOpenDm = () => {
    openDirectMessage({
      id: incomingDmToast.senderId,
      username: incomingDmToast.senderName,
      avatarColor: incomingDmToast.avatarColor,
    });
    clearIncomingDmToast();
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div
        onClick={handleOpenDm}
        className="group relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 p-3.5 flex items-start gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-all"
      >
        {/* Glowing aura ping */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
        </span>

        {/* Sender Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md"
            style={{ backgroundColor: incomingDmToast.avatarColor || '#6366f1' }}
          >
            {incomingDmToast.senderName ? incomingDmToast.senderName.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {incomingDmToast.senderName}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-extrabold tracking-wider uppercase">
              Private DM
            </span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-snug">
            {incomingDmToast.text}
          </p>

          <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            <span>Tap to reply directly</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            clearIncomingDmToast();
          }}
          className="absolute top-2.5 right-2.5 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
