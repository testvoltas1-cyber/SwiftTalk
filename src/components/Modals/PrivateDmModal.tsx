import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Search,
  Users,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const PrivateDmModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    pinnedUsers,
    unpinUser,
    openDirectMessage,
    groupUsers,
    myUserId,
    clearAllDMs,
  } = useChat();

  const [search, setSearch] = useState('');

  if (activeModal !== 'private_dms') return null;

  const isUserOnline = (userId: string) => {
    return groupUsers.some((u) => u.id === userId);
  };

  const filteredUsers = pinnedUsers.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = pinnedUsers.reduce((sum, u) => sum + (u.unreadCount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Private DM Inbox
                </h3>
                {totalUnread > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-extrabold shadow-sm animate-pulse">
                    {totalUnread} new
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Direct 1-on-1 private conversations & pinned contacts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pinnedUsers.length > 0 && (
              <button
                type="button"
                onClick={() => clearAllDMs()}
                className="px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1.5"
                title="Clear All Private DMs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={() => setActiveModal('none')}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search private chats by name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* User Conversation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {pinnedUsers.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-xs mx-auto">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  No Private DMs Yet
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  When someone messages you or when you click <span className="font-semibold text-indigo-500">DM</span> on any user in a chatroom, they will appear here automatically!
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500 dark:text-zinc-400">
              No matching private contacts found.
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {filteredUsers.map((user) => {
                const online = isUserOnline(user.id);

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      setActiveModal('none');
                      openDirectMessage({
                        id: user.id,
                        username: user.username,
                        avatarColor: user.avatarColor || '#6366f1',
                      });
                    }}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 border border-zinc-200/60 dark:border-zinc-700/60 hover:border-indigo-500/30 cursor-pointer transition-all shadow-xs"
                  >
                    {/* Left Avatar & Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs"
                          style={{ backgroundColor: user.avatarColor || '#6366f1' }}
                        >
                          {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        {online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {user.username}
                          </p>
                          {online ? (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                              Online
                            </span>
                          ) : (
                            <span className="text-zinc-400 text-[10px]">Offline</span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[220px] sm:max-w-xs">
                          {user.lastMessage ? user.lastMessage : 'Start chatting in private...'}
                        </p>
                      </div>
                    </div>

                    {/* Right Actions: Unread Badge, Open, Remove Cross */}
                    <div className="flex items-center gap-2 shrink-0">
                      {user.unreadCount && user.unreadCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold animate-pulse">
                          {user.unreadCount}
                        </span>
                      ) : null}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          unpinUser(user.id);
                        }}
                        className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-70 group-hover:opacity-100 transition-all"
                        title="Remove from Private DMs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>End-to-End P2P encrypted direct messaging</span>
          </div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {pinnedUsers.length} Contact{pinnedUsers.length === 1 ? '' : 's'}
          </span>
        </div>

      </div>
    </div>
  );
};
