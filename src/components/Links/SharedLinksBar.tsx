import React, { useState } from 'react';
import {
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Globe,
  Radio,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import type { SharedLink } from '../../types/chat';

interface SharedLinksBarProps {
  onOpenShareModal: () => void;
  channelName?: string;
}

export const SharedLinksBar: React.FC<SharedLinksBarProps> = ({
  onOpenShareModal,
  channelName = 'chatindian',
}) => {
  const { sharedLinks } = useChat();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (e: React.MouseEvent, link: SharedLink) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatTime = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours}h ago`;
  };

  return (
    <div
      id="shared-links-bar"
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-all duration-200"
    >
      {/* Header bar / Ticker */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/40 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-900 hover:bg-blue-50 dark:hover:bg-zinc-850/80 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold shadow-xs shrink-0">
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Shared Links</span>
          </div>

          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold shrink-0">
            {sharedLinks.length}
          </span>

          {/* Quick teaser of latest link */}
          {sharedLinks.length > 0 ? (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300 truncate">
              <span className="text-zinc-400 font-normal">Latest:</span>
              <span className="font-semibold truncate max-w-[240px] text-zinc-800 dark:text-zinc-200">
                {sharedLinks[0].title || sharedLinks[0].url}
              </span>
              <span className="text-[10px] text-zinc-400">({formatTime(sharedLinks[0].timestamp)})</span>
            </div>
          ) : (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              Share any link or website with 0 ban & instant visibility for all users
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenShareModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#5ec5a4] hover:bg-[#4db292] active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Toggle link list"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Links List */}
      {isExpanded && (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2 max-h-72 overflow-y-auto">
          {sharedLinks.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                No links shared in this session yet
              </p>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                Share any YouTube link, blog, Instagram, photo, or website URL. It appears here for all online users without any ban or restrictions!
              </p>
              <button
                onClick={onOpenShareModal}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Share First Link</span>
              </button>
            </div>
          ) : (
            sharedLinks.map((link) => (
              <div
                key={link.id}
                className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex items-start gap-2.5 overflow-hidden flex-1 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-2xs"
                    style={{ backgroundColor: link.avatarColor || '#6366f1' }}
                  >
                    {(link.senderName || 'A').charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        {link.title || link.url}
                      </span>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        • {formatTime(link.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400 truncate mt-0.5 hover:underline cursor-pointer" onClick={(e) => handleOpenLink(e, link.url)}>
                      {link.url}
                    </p>

                    <span className="text-[10px] text-zinc-400">
                      By <span className="font-semibold text-zinc-600 dark:text-zinc-300">{link.senderName}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={(e) => handleCopyLink(e, link)}
                    className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy Link"
                  >
                    {copiedId === link.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => handleOpenLink(e, link.url)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Open in new tab"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
