import React, { useState } from 'react';
import {
  MessageSquare,
  MessageCircle,
  Users,
  Search,
  Plus,
  Gamepad2,
  Music,
  Code,
  Film,
  Coffee,
  Heart,
  User,
  Sparkles,
  ArrowRight,
  Zap,
  Link2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import type { GroupRoom } from '../types/chat';

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Film: <Film className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
};

const CATEGORIES = ['All', 'Main', 'Gaming', 'Entertainment', 'Tech', 'Social'];

export const GroupExplorer: React.FC = () => {
  const {
    groupList,
    joinGroupRoom,
    tempUsername,
    avatarColor,
    setActiveModal,
    pinnedUsers,
  } = useChat();

  const totalUnreadDms = pinnedUsers.reduce((acc, u) => acc + (u.unreadCount || 0), 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGroups = groupList.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      group.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner & Temp User Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-zinc-900 to-purple-950 p-6 sm:p-8 border border-indigo-500/20 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>No Login Needed • Anonymous Chatrooms</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Live Group Chatrooms
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Join any group chat room instantly! Chat with live users across gaming, music, tech, and casual hangout channels with no registration required.
            </p>
          </div>

          {/* Current Temp User Card */}
          <div className="shrink-0 bg-white/10 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-inner shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {tempUsername.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-zinc-400 font-medium block">Active Temp Name</span>
              <p className="text-sm font-bold text-white truncate max-w-[140px]">
                {tempUsername}
              </p>
              <button
                onClick={() => setActiveModal('username')}
                className="text-xs text-indigo-300 hover:text-indigo-200 underline font-medium flex items-center gap-1 transition-colors"
              >
                <User className="w-3 h-3" /> Change Name
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, and Create Group */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chatrooms by name or topic..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Private DM Inbox Trigger Button with Glow and Ping Badge */}
          <button
            onClick={() => setActiveModal('private_dms')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
              totalUnreadDms > 0
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-400 shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-400 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 animate-pulse'
                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 text-indigo-600 dark:text-indigo-400'
            }`}
            title="Open Private DM Inbox"
          >
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
              {totalUnreadDms > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}
            </div>
            <span>Private DM</span>
            {totalUnreadDms > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs">
                {totalUnreadDms}
              </span>
            ) : pinnedUsers.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/15 dark:bg-indigo-400/20 text-[10px] font-bold">
                {pinnedUsers.length}
              </span>
            ) : null}
          </button>

          {/* Join via Link / Code Button */}
          <button
            onClick={() => setActiveModal('join_by_code')}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            title="Join a private chatroom using invite link or code"
          >
            <Link2 className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Join via Link</span>
          </button>

          {/* Create Custom Group Button */}
          <button
            onClick={() => setActiveModal('create_group')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Chatroom</span>
          </button>
        </div>
      </div>

      {/* Chatrooms Grid */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-3">
          <MessageSquare className="w-10 h-10 mx-auto text-zinc-400" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            No chatrooms found
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Try adjusting your search terms or category filters.
          </p>
          <button
            onClick={() => setActiveModal('create_group')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow"
          >
            <Plus className="w-4 h-4" /> Create a Chatroom
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => joinGroupRoom(group.id)}
              className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 cursor-pointer"
            >
              {/* Room Top Section */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {ICON_MAP[group.icon] || <MessageSquare className="w-5 h-5" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-semibold">
                      {group.category}
                    </span>
                    {group.isCustom && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {group.topic}
                  </p>
                </div>
              </div>

              {/* Room Bottom: Live User Counter & Join Button */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Users className="w-3.5 h-3.5" />
                  <span>{group.userCount} {group.userCount === 1 ? 'user live' : 'users live'}</span>
                </div>

                <button
                  onClick={() => joinGroupRoom(group.id)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Join Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fast Instructions Footer */}
      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Tip: Messages inside group chatrooms are real-time, live, and ephemeral. Respect all chat participants!</span>
        </div>
        <button
          onClick={() => setActiveModal('terms')}
          className="text-indigo-600 dark:text-indigo-400 underline font-semibold shrink-0"
        >
          Community Guidelines
        </button>
      </div>

    </div>
  );
};
