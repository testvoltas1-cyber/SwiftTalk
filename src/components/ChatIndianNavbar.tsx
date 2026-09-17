import React from 'react';
import { ChatIndianLogo } from './ChatIndianLogo';

interface ChatIndianNavbarProps {
  onGoHome?: () => void;
  onOpenEmbedModal?: () => void;
  onOpenPhotoModal?: () => void;
  onOpenLinkModal?: () => void;
  activeChannel?: string;
  onSelectChannel?: (channel: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const ChatIndianNavbar: React.FC<ChatIndianNavbarProps> = ({
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full shrink-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-xs transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo ONLY */}
        <div className="flex items-center">
          <div onClick={onGoHome} className="cursor-pointer flex items-center">
            <ChatIndianLogo size="md" />
          </div>
        </div>
      </div>
    </header>
  );
};

