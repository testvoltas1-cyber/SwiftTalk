import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const AVATAR_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6',
  '#06b6d4', '#f97316', '#3b82f6', '#14b8a6', '#e11d48'
];

export const UsernameModal: React.FC = () => {
  const { tempUsername, avatarColor, setTempUsername, setActiveModal } = useChat();
  const [nameInput, setNameInput] = useState(tempUsername);
  const [selectedColor, setSelectedColor] = useState(avatarColor);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setTempUsername(nameInput.trim(), selectedColor);
      setActiveModal('none');
    }
  };

  const handleRandomize = () => {
    const randomNames = [
      'CoolPanda', 'CyberWolf', 'NeonTiger', 'AuraRider',
      'StarGazer', 'SkyWalker', 'VibeSeeker', 'EchoKnight',
      'PixelSamurai', 'ZenMaster', 'ThunderStorm', 'ShadowFalcon'
    ];
    const name = randomNames[Math.floor(Math.random() * randomNames.length)] + '_' + Math.floor(10 + Math.random() * 90);
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    setNameInput(name);
    setSelectedColor(color);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Temporary Username
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No login or password needed
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* Avatar Preview & Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Choose Nickname
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 transition-all"
                style={{ backgroundColor: selectedColor }}
              >
                {nameInput.trim() ? nameInput.trim().charAt(0).toUpperCase() : '?'}
              </div>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={24}
                placeholder="Enter temporary nickname..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <button
                type="button"
                onClick={handleRandomize}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                title="Randomize Username"
              >
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </button>
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Avatar Color Badge
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation Notice */}
          <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-600 dark:text-indigo-400 space-y-1">
            <p className="font-semibold">💡 Instant & Anonymous</p>
            <p className="text-zinc-500 dark:text-zinc-400">
              This username will be visible to live users inside chatrooms. You can change it anytime with zero registration.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
            >
              Set Nickname
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
