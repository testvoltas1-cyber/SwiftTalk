import React, { useState, useEffect } from 'react';
import { Search, Hash, X, Lightbulb } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ICEBREAKERS = [
  "What's your favorite movie or TV show of all time?",
  "If you could travel anywhere right now, where would you go?",
  "What song have you been playing on repeat lately?",
  "What's the best piece of advice you've ever received?",
  "Coffee or tea? What's your go-to drink?",
  "What's a topic you could talk about for hours?",
];

export const MatchingScreen: React.FC = () => {
  const { preferences, stopChat } = useChat();
  const [icebreakerIndex, setIcebreakerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIcebreakerIndex((prev) => (prev + 1) % ICEBREAKERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-[calc(100vh-4rem)]">
      
      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        
        {/* Radar Radar Animation */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping opacity-75"></div>
          <div className="absolute inset-2 rounded-full border-2 border-indigo-500/40 animate-pulse"></div>
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Search className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Searching Status text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Looking for a Stranger...
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Searching active queue for available chat partners.
          </p>
        </div>

        {/* Selected Interests tags indicator */}
        {preferences.interests.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Hash className="w-3.5 h-3.5 text-indigo-500" />
              <span>Matching Topics</span>
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {preferences.interests.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Icebreaker Prompt Suggestion */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left space-y-1 transition-all">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Icebreaker Idea for when you connect:</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200 font-medium italic">
            "{ICEBREAKERS[icebreakerIndex]}"
          </p>
        </div>

        {/* Cancel Button */}
        <div>
          <button
            onClick={stopChat}
            className="w-full py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Stop Searching</span>
          </button>
        </div>

      </div>
    </div>
  );
};
