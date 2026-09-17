import React, { useState } from 'react';
import { X, Link2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const JoinByCodeModal: React.FC = () => {
  const { joinGroupRoom, setActiveModal } = useChat();
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    let roomId = raw;

    // Check if user pasted a full URL or query/hash
    try {
      if (raw.includes('room=')) {
        const urlObj = new URL(raw, window.location.origin);
        const searchRoom = urlObj.searchParams.get('room');
        if (searchRoom) {
          roomId = searchRoom;
        } else if (urlObj.hash.includes('room=')) {
          const hashParams = new URLSearchParams(urlObj.hash.replace(/^#\/?/, ''));
          const hashRoom = hashParams.get('room');
          if (hashRoom) roomId = hashRoom;
        }
      } else if (raw.includes('/')) {
        // e.g. path format
        const parts = raw.split('/');
        const lastPart = parts[parts.length - 1].split('?')[0].split('#')[0];
        if (lastPart) roomId = lastPart;
      }
    } catch (err) {
      // Fallback to raw string
      roomId = raw;
    }

    // Clean room ID
    roomId = roomId.replace(/^[#?]/, '').trim();

    if (!roomId) {
      setError('Please enter a valid room link or code.');
      return;
    }

    joinGroupRoom(roomId);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Join Private Chatroom
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Enter an invite link or room code
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleJoin} className="p-6 space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Invite Link or Room Code *
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                placeholder="e.g. room_abc123 or paste invite link..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-500 font-semibold">{error}</p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Private chatrooms are completely end-to-end ephemeral. No account or password required.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>Join Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
