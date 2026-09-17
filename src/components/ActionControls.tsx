import React, { useEffect } from 'react';
import { Play, SkipForward, StopCircle, Flag, ShieldX, Wifi, Trash2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const ActionControls: React.FC = () => {
  const {
    connectionStatus,
    connectionType,
    startChat,
    nextStranger,
    stopChat,
    blockStranger,
    setActiveModal,
    messages,
    clearChat,
  } = useChat();

  // Global Keyboard Shortcuts (Esc = Next Stranger, Alt+S = Stop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // If Escape pressed inside chat input when connected/disconnected
        if (e.key === 'Escape' && (connectionStatus === 'connected' || connectionStatus === 'disconnected')) {
          e.preventDefault();
          nextStranger();
        }
        return;
      }

      if (e.key === 'Escape') {
        if (connectionStatus === 'connected' || connectionStatus === 'disconnected') {
          nextStranger();
        } else if (connectionStatus === 'searching') {
          stopChat();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [connectionStatus, nextStranger, stopChat]);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Connection Type Indicator Badge */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <Wifi className={`w-4 h-4 ${
            connectionType === 'webrtc'
              ? 'text-emerald-500'
              : connectionType === 'websocket'
              ? 'text-amber-500'
              : 'text-zinc-400'
          }`} />
          <span>
            {connectionType === 'webrtc' && 'WebRTC P2P Direct'}
            {connectionType === 'websocket' && 'Relay Server Mode'}
            {connectionType === 'none' && (connectionStatus === 'searching' ? 'Searching...' : 'Offline')}
          </span>
        </div>

        {/* Action Controls Group */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Start Chat Button */}
          {connectionStatus === 'idle' && (
            <button
              onClick={startChat}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Chat</span>
            </button>
          )}

          {/* Next Stranger Button */}
          {(connectionStatus === 'connected' || connectionStatus === 'disconnected') && (
            <button
              onClick={nextStranger}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              title="Skip to Next Stranger (Shortcut: Esc)"
            >
              <SkipForward className="w-4 h-4 fill-current" />
              <span>Next Stranger</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] bg-indigo-700 rounded text-indigo-100 font-mono">Esc</kbd>
            </button>
          )}

          {/* Stop Button */}
          {connectionStatus !== 'idle' && (
            <button
              onClick={stopChat}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              title="Stop Chat"
            >
              <StopCircle className="w-4 h-4 text-zinc-500" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}

          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              id="action-clear-chat-button"
              type="button"
              onClick={clearChat}
              className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 text-zinc-600 dark:text-zinc-400 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Clear all messages from display"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span className="hidden md:inline">Clear Chat</span>
            </button>
          )}

          {/* Block Button */}
          {connectionStatus === 'connected' && (
            <button
              onClick={blockStranger}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-zinc-600 dark:text-zinc-400 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              title="Block Stranger"
            >
              <ShieldX className="w-4.5 h-4.5" />
              <span className="hidden md:inline">Block</span>
            </button>
          )}

          {/* Report Button */}
          {(connectionStatus === 'connected' || connectionStatus === 'disconnected') && (
            <button
              onClick={() => setActiveModal('report')}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              title="Report Stranger"
            >
              <Flag className="w-4.5 h-4.5" />
              <span className="hidden md:inline">Report</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
