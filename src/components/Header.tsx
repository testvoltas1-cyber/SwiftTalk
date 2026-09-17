import React from 'react';
import {
  MessageSquare,
  MessageCircle,
  Shield,
  Lock,
  FileText,
  Settings,
  Sun,
  Moon,
  Users,
  LogOut,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const Header: React.FC = () => {
  const {
    setAppMode,
    activeGroup,
    leaveGroupRoom,
    tempUsername,
    avatarColor,
    onlineStats,
    preferences,
    updatePreferences,
    setActiveModal,
    resetToWelcome,
    pinnedUsers,
  } = useChat();

  const totalUnreadDms = pinnedUsers.reduce((acc, u) => acc + (u.unreadCount || 0), 0);

  const handleGoToExplorer = () => {
    setActiveModal('none');
    setAppMode('groups');
    if (activeGroup) {
      leaveGroupRoom();
    }
  };

  const toggleTheme = () => {
    updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Mode Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={handleGoToExplorer}>
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                Stranger<span className="text-indigo-600 dark:text-indigo-400">Chat</span>
              </h1>
            </div>
          </div>

          {/* Group Rooms Badge */}
          <button
            onClick={handleGoToExplorer}
            className="hidden md:flex items-center px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold gap-1.5 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Rooms</span>
          </button>
        </div>

        {/* Center: Live Online Status Counter */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Users className="w-3.5 h-3.5" />
          <span>{onlineStats.onlineCount.toLocaleString()} Live Users</span>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          
          {/* Private DM Inbox Trigger Button with Glow and Badge */}
          <button
            onClick={() => setActiveModal('private_dms')}
            className={`relative px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
              totalUnreadDms > 0
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-400 shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-400 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
            }`}
            title="Open Private DM Inbox"
          >
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
              {totalUnreadDms > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}
            </div>
            <span className="font-extrabold">Private DM</span>
            {totalUnreadDms > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs flex items-center gap-0.5">
                <span>{totalUnreadDms}</span>
              </span>
            ) : pinnedUsers.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 dark:bg-indigo-400/20 text-[10px] font-bold">
                {pinnedUsers.length}
              </span>
            ) : null}
          </button>

          {/* Active Temp Username Button & Switch Username */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveModal('username')}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              title="Click to edit temp nickname"
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-black shrink-0"
                style={{ backgroundColor: avatarColor }}
              >
                {tempUsername.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[90px] sm:max-w-[120px] truncate">{tempUsername}</span>
            </button>

            <button
              onClick={resetToWelcome}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-all"
              title="Exit / Switch Temporary Username"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setActiveModal('safety')}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-medium hidden md:flex items-center gap-1.5"
            title="Safety Tips"
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Safety</span>
          </button>

          <button
            onClick={() => setActiveModal('privacy')}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-medium hidden lg:flex items-center gap-1.5"
            title="Privacy Policy"
          >
            <Lock className="w-4 h-4 text-indigo-500" />
            <span>Privacy</span>
          </button>

          <button
            onClick={() => setActiveModal('terms')}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-medium hidden lg:flex items-center gap-1.5"
            title="Terms of Service"
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Terms</span>
          </button>

          <button
            onClick={() => setActiveModal('settings')}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={preferences.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-zinc-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
