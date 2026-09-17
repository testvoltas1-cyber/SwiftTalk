import React, { useState } from 'react';
import { MessageSquare, ShieldCheck, Zap, Lock, Hash, Check, AlertCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const AVAILABLE_TAGS = [
  'General',
  'Gaming',
  'Tech & AI',
  'Music',
  'Movies & TV',
  'Anime',
  'Philosophy',
  'Books',
  'Languages',
  'Crypto',
];

export const LandingHero: React.FC = () => {
  const { preferences, updatePreferences, startChat, setActiveModal } = useChat();
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(preferences.ageConfirmed);
  const [ageError, setAgeError] = useState<boolean>(false);

  const toggleInterest = (tag: string) => {
    const current = preferences.interests || [];
    const exists = current.includes(tag);
    let next: string[];
    if (exists) {
      next = current.filter((t) => t !== tag);
    } else {
      if (current.length >= 5) return; // Limit max 5 tags
      next = [...current, tag];
    }
    updatePreferences({ interests: next });
  };

  const handleStart = () => {
    if (!ageConfirmed) {
      setAgeError(true);
      return;
    }
    setAgeError(false);
    updatePreferences({ ageConfirmed: true });
    startChat();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100">
      
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-3xl w-full text-center space-y-8">
        
        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span>WebRTC P2P Direct & Encrypted Signal</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Talk to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500 dark:from-indigo-400 dark:to-emerald-400">Strangers</span> Anonymously.
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal">
            Connect instantly with random people around the globe. No registration required, no chat logs saved, 100% ephemeral.
          </p>
        </div>

        {/* Interest Selection Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none space-y-4 text-left">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-500" />
              <span>Select Interest Topics <span className="text-xs text-zinc-400 font-normal">(Optional, max 5)</span></span>
            </label>
            {preferences.interests.length > 0 && (
              <button
                onClick={() => updatePreferences({ interests: [] })}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear tags
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = preferences.interests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age & Terms Compliance Box */}
        <div className={`p-4 rounded-xl border text-left transition-colors ${
          ageError
            ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
            : 'bg-zinc-100/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => {
                setAgeConfirmed(e.target.checked);
                if (e.target.checked) setAgeError(false);
              }}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              I certify that I am at least <strong>18 years of age</strong> (or age of legal majority in my jurisdiction) and agree to abide by the{' '}
              <button onClick={() => setActiveModal('terms')} className="text-indigo-600 dark:text-indigo-400 underline font-medium">
                Terms of Service
              </button>{' '}
              and{' '}
              <button onClick={() => setActiveModal('safety')} className="text-indigo-600 dark:text-indigo-400 underline font-medium">
                Community Guidelines
              </button>
              . Unlawful harassment, obscenity, or spam is strictly prohibited.
            </span>
          </label>
          {ageError && (
            <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              You must accept the age compliance and community guidelines to start chatting.
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-lg shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <MessageSquare className="w-6 h-6" />
            <span>Start Chatting Now</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Zero Server History</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Messages pass directly peer-to-peer or ephemeral memory. Nothing is stored.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Instant Matchmaking</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Instant matching queue pairs you with active strangers in seconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Report & Block</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              One-click report & block prevents unwanted re-matches and keeps chat safe.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
