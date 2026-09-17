import React from 'react';
import { Shield, X, CheckCircle2, AlertOctagon, HeartHandshake } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const SafetyModal: React.FC = () => {
  const { setActiveModal } = useChat();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Safety Guidelines & Notice</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Essential rules to keep your chat sessions safe and private.
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

        <div className="space-y-6 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-500" />
              <span>Core Principle: Mutual Respect & Privacy</span>
            </h3>
            <p>
              StrangerChat is designed for lighthearted, respectful, and anonymous interactions. Treat everyone with dignity and never share sensitive details.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-sm">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              <span>What NEVER to Share with Strangers:</span>
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Personal Identity:</strong> Your full name, phone number, address, or email address.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Social Profiles:</strong> Instagram, Snapchat, Discord, or LinkedIn usernames.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Financial Data:</strong> Bank accounts, credit cards, crypto wallet addresses, or wire requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Security Info:</strong> Passwords, verification codes, or location coordinates.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span>Safety Features Available to You:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Instant Report Button</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Reports misconduct instantly to automated flag filters and disconnects chat.</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Session Peer Block</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Blocks stranger ID from ever matching with you again in future sessions.</p>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={() => setActiveModal('none')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
