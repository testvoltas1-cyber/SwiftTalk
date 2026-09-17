import React, { useState } from 'react';
import { MessageSquare, Sparkles, ShieldCheck, Users, Zap, Check, ArrowRight, Dices, Lock } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const AVATAR_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6',
  '#06b6d4', '#f97316', '#3b82f6', '#14b8a6', '#e11d48'
];

const RANDOM_NAMES = [
  'CoolPanda', 'CyberWolf', 'NeonTiger', 'AuraRider',
  'StarGazer', 'SkyWalker', 'VibeSeeker', 'EchoKnight',
  'PixelSamurai', 'ZenMaster', 'ThunderStorm', 'ShadowFalcon',
  'AlphaRogue', 'VelvetVibe', 'SolarPioneer', 'CosmicDrifter'
];

export const WelcomeScreen: React.FC = () => {
  const { tempUsername, avatarColor, enterChat, onlineStats } = useChat();

  const [usernameInput, setUsernameInput] = useState(() => tempUsername || 'Guest_' + Math.floor(1000 + Math.random() * 9000));
  const [selectedColor, setSelectedColor] = useState(avatarColor || '#6366f1');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const handleRandomize = () => {
    const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)] + '_' + Math.floor(10 + Math.random() * 90);
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    setUsernameInput(name);
    setSelectedColor(color);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() && agreedTerms) {
      enterChat(usernameInput.trim(), selectedColor);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-indigo-950 text-white">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-xl space-y-8 text-center">
        
        {/* Header Branding */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Instant Anonymous Chatroom Access</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Stranger<span className="text-indigo-400">Chat</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Pehle apna <span className="text-indigo-300 font-bold">Temporary Username</span> choose karein, uske baad live group chatrooms me jakar sabhi users se baat karein.
          </p>
        </div>

        {/* Temporary Username Entry Box */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-left space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="border-b border-zinc-800/80 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Step 1: Temporary Username</span>
              </h2>
              <p className="text-xs text-zinc-400">No email, phone or password required</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{onlineStats.onlineCount} Live Users</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Input & Randomizer */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Choose Temporary Nickname *
              </label>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shrink-0 transition-transform hover:scale-105"
                  style={{ backgroundColor: selectedColor }}
                >
                  {usernameInput.trim() ? usernameInput.trim().charAt(0).toUpperCase() : '?'}
                </div>

                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  maxLength={24}
                  required
                  placeholder="e.g. CoolPanda_99"
                  className="flex-1 px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800/90 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-500"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={handleRandomize}
                  className="p-3 rounded-2xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-all flex items-center justify-center shrink-0"
                  title="Randomize Nickname"
                >
                  <Dices className="w-5 h-5 text-indigo-400" />
                </button>
              </div>
            </div>

            {/* Avatar Color Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Avatar Color Badge
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className="h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: selectedColor }}
                >
                  {usernameInput.trim() ? usernameInput.trim().charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Chat Preview</span>
                  <span className="text-xs font-bold text-white">{usernameInput.trim() || 'Anonymous'}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                Ready to Join
              </span>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-zinc-400 leading-snug">
                I am 18+ and agree to the <span className="text-indigo-400 underline">Community Guidelines</span> (No harassment, spam, or unlawful behavior).
              </span>
            </label>

            {/* Primary Join Button */}
            <button
              type="submit"
              disabled={!usernameInput.trim() || !agreedTerms}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Enter Chatrooms Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </form>
        </div>

        {/* Feature Highlights Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <Users className="w-4 h-4" />
              <span>Group Chatrooms</span>
            </div>
            <p className="text-[11px] text-zinc-400">Gaming, Music, Tech, Movies & Hangout channels.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Lock className="w-4 h-4" />
              <span>100% Anonymous</span>
            </div>
            <p className="text-[11px] text-zinc-400">Zero registration logs or permanent chat storage.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Zap className="w-4 h-4" />
              <span>Live Conversations</span>
            </div>
            <p className="text-[11px] text-zinc-400">Chat with real users in real-time instantly.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
