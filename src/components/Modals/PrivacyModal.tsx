import React from 'react';
import { Lock, X, Check, Database, Server, ShieldCheck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const PrivacyModal: React.FC = () => {
  const { setActiveModal } = useChat();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Privacy Policy</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Zero log retention & peer-to-peer messaging policy.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-indigo-900 dark:text-indigo-200">No Account & No Database Storage</h3>
              <p className="text-xs text-indigo-800 dark:text-indigo-300">
                We do not maintain user databases, accounts, or persistent message logs. Messages exist only in browser memory during an active session and vanish when the chat ends.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">1. WebRTC Peer-to-Peer Data Transfer</h3>
            <p>
              When WebRTC is established, chat text travels directly between your device and your chat partner's device. No intermediary server receives or reads the text content.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">2. Ephemeral Signaling Data</h3>
            <p>
              During matchmaking, our lightweight signaling service receives temporary socket IDs and interest preferences to pair users up. Signaling tokens are discarded immediately when matchmaking completes.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">3. Local Device Preferences</h3>
            <p>
              Your local blocked list and UI preferences (such as theme and sound) are stored strictly inside your browser's local storage (`localStorage`). They are never uploaded to any remote server.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Summary Checklist</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> No registration
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> No cookies tracking
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> No chat archive
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> No personal data sold
              </span>
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={() => setActiveModal('none')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
