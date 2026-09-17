import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Maximize2,
  Minimize2,
  Code,
  ArrowLeft,
  ExternalLink,
  Users,
  Radio,
  Share2,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Trash2,
  X,
  Copy,
  Check,
  FileText,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { PhotoShareModal } from './Modals/PhotoShareModal';
import { LinkShareModal } from './Modals/LinkShareModal';
import { SharedLinksBar } from './Links/SharedLinksBar';

const PROMO_REALNAME = 'Free PDF Tools @ pdftoolkitpro.online';
const PROMO_QUIT_MSG = 'Visit pdftoolkitpro.online for Free PDF Tools!';
const PROMO_QUIT_COMMAND = '/quit Visit pdftoolkitpro.online for Free PDF Tools!';

interface ChatIndianChatBoxProps {
  nickname: string;
  channel?: string;
  onBackToLanding: () => void;
  onOpenEmbedModal: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const ChatIndianChatBox: React.FC<ChatIndianChatBoxProps> = ({
  nickname,
  channel = 'allindiachat.com',
  onBackToLanding,
  onOpenEmbedModal,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const { clearChat } = useChat();
  const [currentChannel, setCurrentChannel] = useState(channel.replace(/^#/, '') || 'allindiachat.com');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showClearToast, setShowClearToast] = useState(false);
  const [copiedQuit, setCopiedQuit] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCopyQuitCommand = () => {
    navigator.clipboard.writeText(PROMO_QUIT_COMMAND);
    setCopiedQuit(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopiedQuit(false);
    }, 3000);
  };

  // Sync external channel prop when selected from navbar without resetting iframe
  useEffect(() => {
    if (channel) {
      const clean = channel.replace(/^#/, '');
      if (clean) setCurrentChannel(clean);
    }
  }, [channel]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleClearChat = () => {
    // Clear local chat history without reloading iframe to prevent IRC logout
    clearChat();
    setShowClearToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowClearToast(false);
    }, 4500);
  };

  const cleanNick = useMemo(() => {
    const trimmed = (nickname || '').trim();
    if (!trimmed || trimmed.toUpperCase() === 'PRIYA') return '';
    return trimmed;
  }, [nickname]);

  // Only #allindiachat.com channel
  const ACTIVE_CHANNELS = useMemo(() => [
    { name: 'allindiachat.com', label: '#allindiachat.com' },
  ], []);

  // Construct stable KiwiIRC URL with Realname (GECOS) set to Free PDF Tools @ pdftoolkitpro.online
  // Joins exclusively #allindiachat.com
  const iframeUrl = useMemo(() => {
    const encodedRealname = encodeURIComponent(PROMO_REALNAME);
    const allChannelsHash = '#allindiachat.com';
    // If cleanNick is empty, do NOT pass nick= so KiwiIRC's Nick input field remains completely blank
    const nickParam = cleanNick ? `nick=${encodeURIComponent(cleanNick)}&` : '';
    return `https://kiwiirc.hybridirc.com/?${nickParam}realname=${encodedRealname}&gecos=${encodedRealname}${allChannelsHash}`;
  }, [cleanNick]);

  const handleSwitchChannel = (chanName: string) => {
    const clean = chanName.replace(/^#/, '');
    setCurrentChannel(clean);
  };

  return (
    <div className="w-full bg-[#fafbfc] dark:bg-zinc-950 py-2 sm:py-3 px-3 sm:px-6 lg:px-8 transition-colors flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Main KiwiIRC Chat Box */}
        <div className="w-full flex-1 min-h-0 bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 shadow-md overflow-hidden relative flex flex-col">
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; picture-in-picture; web-share"
            className="w-full h-full flex-1 border-0"
            title="ChatIndian Live Chat Client"
          />
        </div>

        {/* Bottom Actions Bar */}
        {onToggleFullscreen && (
          <div className="flex items-center justify-start pt-1.5 text-xs shrink-0">
            <button
              onClick={onToggleFullscreen}
              type="button"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit fullscreen mode</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Open in fullscreen mode</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* Photo & GIF Share Modal */}
      <PhotoShareModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        channelName={currentChannel}
      />

      {/* Safe Unrestricted Link Share Modal */}
      <LinkShareModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        channelName={currentChannel}
      />
    </div>
  );
};
