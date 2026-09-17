import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Timer,
  Eye,
  Lock,
  X,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface MediaBubbleProps {
  mediaType?: 'photo' | 'gif';
  mediaUrl?: string;
  ephemeralTimer?: number; // In seconds, e.g., 5, 10, 30, 60, 300, 600
  timestamp: number;
  isMine?: boolean;
  isExpired?: boolean;
  onExpire?: () => void;
}

export const MediaBubble: React.FC<MediaBubbleProps> = ({
  mediaType,
  mediaUrl,
  ephemeralTimer,
  timestamp,
  isMine,
  isExpired: initialExpired,
  onExpire,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() => {
    if (ephemeralTimer && ephemeralTimer > 0) return ephemeralTimer;
    return null;
  });
  const [expired, setExpired] = useState<boolean>(() => {
    if (initialExpired) return true;
    // Default 10 minutes absolute expiration for storage safety
    const tenMinutes = 10 * 60 * 1000;
    if (Date.now() - timestamp > tenMinutes) return true;
    return false;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check 10-minute auto-delete threshold
  useEffect(() => {
    if (expired) return;
    const tenMinutes = 10 * 60 * 1000;
    const elapsed = Date.now() - timestamp;
    const remaining = tenMinutes - elapsed;

    if (remaining <= 0) {
      setExpired(true);
      onExpire?.();
      return;
    }

    const timeout = setTimeout(() => {
      setExpired(true);
      onExpire?.();
    }, remaining);

    return () => clearTimeout(timeout);
  }, [timestamp, expired, onExpire]);

  // Handle active self-destruct countdown once opened/viewed
  useEffect(() => {
    if (!isViewed || !ephemeralTimer || expired) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setExpired(true);
          setIsOpen(false);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isViewed, ephemeralTimer, expired, onExpire]);

  // If expired or no URL
  if (expired || !mediaUrl) {
    return (
      <div
        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold select-none ${
          isMine
            ? 'bg-indigo-700/60 text-indigo-100 border border-indigo-500/30'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60'
        }`}
      >
        <Flame className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
        <div className="flex flex-col">
          <span>{ephemeralTimer ? 'Photo Self-Destructed' : 'Media Expired (Auto-Cleaned)'}</span>
          <span className="text-[10px] opacity-75 font-normal">
            Permanently deleted to preserve privacy & storage.
          </span>
        </div>
      </div>
    );
  }

  const isEphemeral = Boolean(ephemeralTimer && ephemeralTimer > 0);

  const handleOpenViewer = () => {
    if (expired) return;
    setIsViewed(true);
    setIsOpen(true);
  };

  return (
    <div className="space-y-1.5 select-none">
      {/* Ephemeral / View Once Locked Placeholder */}
      {isEphemeral && !isMine && !isViewed ? (
        <button
          type="button"
          onClick={handleOpenViewer}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-left">
              <p className="flex items-center gap-1.5">
                <span>View-Once Photo</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-600/20 text-[10px] font-extrabold">
                  ⏱️ {ephemeralTimer}s
                </span>
              </p>
              <p className="text-[10px] opacity-80 font-normal">Tap to open • Auto-destructs</p>
            </div>
          </div>

          <div className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-300">
            <Eye className="w-4 h-4" />
          </div>
        </button>
      ) : (
        /* Regular Image or My Sent Ephemeral Image */
        <div className="relative group/media overflow-hidden rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-900">
          <img
            src={mediaUrl}
            alt={mediaType === 'gif' ? 'Shared GIF' : 'Shared Photo'}
            onClick={handleOpenViewer}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            className={`max-h-64 sm:max-h-72 w-auto max-w-full rounded-xl object-contain cursor-pointer transition-transform duration-200 hover:scale-[1.01] ${
              isEphemeral && isViewed ? 'blur-xs hover:blur-none' : ''
            }`}
            loading="lazy"
          />

          {/* Ephemeral Timer Badge Overlay */}
          {isEphemeral && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 shadow-md border border-white/20">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>
                {secondsLeft !== null ? `${secondsLeft}s left` : `${ephemeralTimer}s`}
              </span>
            </div>
          )}

          {/* GIF Badge Overlay */}
          {mediaType === 'gif' && (
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider">
              GIF
            </div>
          )}

          {/* 10 Min Auto Clean Indicator */}
          {!isEphemeral && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-zinc-300 text-[9px] flex items-center gap-1 opacity-0 group-hover/media:opacity-100 transition-opacity">
              <Clock className="w-2.5 h-2.5" />
              <span>Auto-deletes in 10m</span>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen / Focused Secure Viewer Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Top Bar with Timer and Security Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Screenshot Protected</span>
              </div>

              {isEphemeral && secondsLeft !== null && (
                <div className="px-3 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg animate-pulse">
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Self-Destructing in {secondsLeft}s</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image with Anti-Drag & Watermark */}
          <div className="relative max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-zinc-800">
            <img
              src={mediaUrl}
              alt="Media Preview"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              className="max-h-[75vh] w-auto max-w-full object-contain pointer-events-auto rounded-2xl"
            />

            {/* Live Progress Bar for Ephemeral Media */}
            {isEphemeral && secondsLeft !== null && ephemeralTimer && (
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/60">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-1000 ease-linear"
                  style={{
                    width: `${Math.max(0, (secondsLeft / ephemeralTimer) * 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
