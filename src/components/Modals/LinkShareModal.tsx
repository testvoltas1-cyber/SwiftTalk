import React, { useState } from 'react';
import {
  Link as LinkIcon,
  X,
  Send,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Sparkles,
  ExternalLink,
  Share2,
  Lock,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface LinkShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName?: string;
}

export const LinkShareModal: React.FC<LinkShareModalProps> = ({
  isOpen,
  onClose,
  channelName = 'chatindian',
}) => {
  const { sharePublicLink, tempUsername } = useChat();
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);

  if (!isOpen) return null;

  // Clean URL parsing
  const rawUrl = urlInput.trim();
  let fullUrl = rawUrl;
  if (rawUrl && !/^https?:\/\//i.test(rawUrl)) {
    fullUrl = 'https://' + rawUrl;
  }

  // Safe bot-bypass formats to prevent IRC automatic anti-spam bots from kicking
  const dotBypass = rawUrl
    .replace(/^https?:\/\//i, '')
    .replace(/\./g, ' [dot] ')
    .replace(/\//g, ' / ');

  const handleShareToLiveBoard = async () => {
    if (!fullUrl) return;
    setIsSharing(true);
    try {
      await sharePublicLink(fullUrl, titleInput.trim() || rawUrl, channelName);
      setSharedSuccess(true);
      setTimeout(() => {
        setSharedSuccess(false);
        setUrlInput('');
        setTitleInput('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = (text: string, formatKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatKey);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div
      id="link-share-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>Share Link Without Ban</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  Unrestricted
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Share any website, YouTube video, social link or media without restrictions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Anti-Ban Guarantee Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 dark:text-emerald-200">
              <p className="font-semibold">Zero Restrictions & No Auto-Ban</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                Links broadcast in real-time to everyone on the site in the Live Shared Links bar and can be safely clicked without leaving chat.
              </p>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Enter Link / Website URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=... or any web link"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Optional Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Link Title / Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Watch this awesome song / Join my blog"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action 1: Broadcast to Live Shared Links Board */}
          <div className="pt-2">
            <button
              onClick={handleShareToLiveBoard}
              disabled={!rawUrl || isSharing}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                rawUrl && !isSharing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.99]'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {sharedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Shared Successfully to Live Board!</span>
                </>
              ) : isSharing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Broadcasting Link...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Broadcast Link to Everyone Online</span>
                </>
              )}
            </button>
          </div>

          {/* Action 2: Safe Copy Formats for IRC Chat Box */}
          {rawUrl && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Or Copy Formatted Link for IRC Chat Window:</span>
              </h4>

              {/* Format 1: Direct Clean Link */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs">
                <div className="truncate pr-2">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-300">Direct URL: </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{fullUrl}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(fullUrl, 'direct')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-zinc-700 dark:text-zinc-200 font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copiedFormat === 'direct' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFormat === 'direct' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Format 2: Anti-Bot Bypass Format */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs">
                <div className="truncate pr-2">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-300">Bot-Bypass Text: </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{dotBypass}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(dotBypass, 'bypass')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-zinc-700 dark:text-zinc-200 font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copiedFormat === 'bypass' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFormat === 'bypass' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-blue-500" />
            <span>Posting as {tempUsername || 'Anonymous'}</span>
          </span>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
