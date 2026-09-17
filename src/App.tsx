import React, { useState, useEffect } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { ChatIndianNavbar } from './components/ChatIndianNavbar';
import { ChatIndianLanding } from './components/ChatIndianLanding';
import { ChatIndianChatBox } from './components/ChatIndianChatBox';
import { EmbedWidgetModal } from './components/Modals/EmbedWidgetModal';
import { PhotoShareModal } from './components/Modals/PhotoShareModal';
import { LinkShareModal } from './components/Modals/LinkShareModal';
import { AntiScreenshotShield } from './components/Security/AntiScreenshotShield';

const ChatIndianMain: React.FC = () => {
  const { preferences, screenshotProtection } = useChat();

  const [nickname, setNickname] = useState<string>(() => {
    try {
      const saved = sessionStorage.getItem('chatindian_nick') || localStorage.getItem('chatindian_nick');
      if (saved && saved.trim() && saved.trim().toUpperCase() !== 'PRIYA') return saved.trim();
    } catch (e) {
      /* ignore */
    }
    return '';
  });

  const [activeChannel, setActiveChannel] = useState<string>('allindiachat.com');
  const [showEmbedModal, setShowEmbedModal] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Clear any legacy 'PRIYA' entry from storage so it never pre-fills
  useEffect(() => {
    try {
      const keys = ['chatindian_nick'];
      keys.forEach((k) => {
        if (sessionStorage.getItem(k)?.toUpperCase() === 'PRIYA') sessionStorage.removeItem(k);
        if (localStorage.getItem(k)?.toUpperCase() === 'PRIYA') localStorage.removeItem(k);
      });
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleGoHome = () => {
    setActiveChannel('chatindian');
  };

  const handleSelectChannel = (channel: string) => {
    const cleanChan = channel.replace(/^#/, '');
    setActiveChannel(cleanChan);
  };

  return (
    <AntiScreenshotShield enabled={screenshotProtection}>
      <div className="h-[100dvh] w-full flex flex-col bg-[#fafbfc] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased transition-colors overflow-hidden">
        
        {/* Top Navbar (ChatIndian matching Pic 1 & 2) */}
        <ChatIndianNavbar
          onGoHome={handleGoHome}
          onOpenEmbedModal={() => setShowEmbedModal(true)}
          onOpenPhotoModal={() => setShowPhotoModal(true)}
          onOpenLinkModal={() => setShowLinkModal(true)}
          activeChannel={activeChannel}
          onSelectChannel={handleSelectChannel}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Single Main Live Chat Page */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ChatIndianChatBox
            nickname={nickname}
            channel={activeChannel}
            onBackToLanding={handleGoHome}
            onOpenEmbedModal={() => setShowEmbedModal(true)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </main>

        {/* Embed Chat Widget to Your Website Modal */}
        <EmbedWidgetModal
          isOpen={showEmbedModal}
          onClose={() => setShowEmbedModal(false)}
          defaultChannel={activeChannel}
        />

        {/* Global Photo & Media Sharing Modal */}
        <PhotoShareModal
          isOpen={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          channelName={activeChannel}
        />

        {/* Global Safe Link Sharing Modal (No Ban & Unrestricted) */}
        <LinkShareModal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          channelName={activeChannel}
        />

      </div>
    </AntiScreenshotShield>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <ChatIndianMain />
    </ChatProvider>
  );
}
