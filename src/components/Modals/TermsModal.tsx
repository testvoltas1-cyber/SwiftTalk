import React from 'react';
import { FileText, X, AlertCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const TermsModal: React.FC = () => {
  const { setActiveModal } = useChat();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Terms & Community Guidelines</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Code of conduct and legal terms of use.
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
          
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>18+ Age Requirement Policy</span>
            </h3>
            <p>
              You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to access or use StrangerChat. Minors under 18 are strictly prohibited.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Zero Tolerance Policy for Conduct Violations</h3>
            <p>Users are strictly prohibited from engaging in any of the following behavior:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Harassment, stalking, intimidation, or hate speech targeting race, gender, religion, or sexual orientation.</li>
              <li>Transmission of obscene, explicit, violent, or unlawful content.</li>
              <li>Attempting to solicit money, financial credentials, or personal identification.</li>
              <li>Deploying automated spam bots, web scrapers, or malicious scripts.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Disclaimers & Limitation of Liability</h3>
            <p>
              StrangerChat is provided "AS IS" without warranties of any kind. Conversations are unmoderated peer-to-peer transmissions between independent strangers. StrangerChat is not liable for user misconduct or content exchanged during private sessions.
            </p>
          </div>

        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={() => setActiveModal('none')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            Accept & Close
          </button>
        </div>

      </div>
    </div>
  );
};
