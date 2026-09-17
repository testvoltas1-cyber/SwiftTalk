import React, { useState } from 'react';
import { Maximize2, Minimize2, Code, Copy, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface ChatIndianLandingProps {
  onStartChat: (nickname: string, password?: string) => void;
  onOpenEmbedModal: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const ChatIndianLanding: React.FC<ChatIndianLandingProps> = ({
  onStartChat,
  onOpenEmbedModal,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [nick, setNick] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chatindian_nick') || localStorage.getItem('chatindian_nick');
      if (saved && saved.trim() && saved.trim().toUpperCase() !== 'PRIYA') return saved.trim();
    } catch (e) {
      /* ignore */
    }
    return '';
  });

  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const embedCodeSnippet = `<iframe src="https://kiwiirc.hybridirc.com/#chatindian" allow="microphone; camera; display-capture; fullscreen" style="border:0; width:100%; height:600px;"></iframe>`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNick = nick.trim() || 'Guest_' + Math.floor(1000 + Math.random() * 9000);
    try {
      sessionStorage.setItem('chatindian_nick', cleanNick);
      localStorage.setItem('chatindian_nick', cleanNick);
    } catch (err) {
      /* ignore */
    }
    onStartChat(cleanNick, hasPassword ? password : undefined);
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCodeSnippet);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = embedCodeSnippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    }
  };

  return (
    <div className="w-full bg-[#fafbfc] dark:bg-zinc-950 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Breadcrumbs & Title Bar (Matching 1st pic) */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h1 className="text-2xl sm:text-3xl font-normal text-zinc-700 dark:text-zinc-200 tracking-tight">
            Chat
          </h1>
          <div className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
            <span className="hover:underline cursor-pointer">Home</span>
            <span className="text-zinc-400 dark:text-zinc-600 mx-1.5">/</span>
            <span className="text-zinc-600 dark:text-zinc-400 font-normal">Chat</span>
          </div>
        </div>

        {/* Main Card Container (Exact replication of 1st pic) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[460px]">
          
          {/* Left Column: Login Form (~42% width) */}
          <div className="w-full md:w-[42%] p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-zinc-900">
            
            <div className="max-w-xs mx-auto w-full space-y-6">
              
              {/* Heading: Welcome! 👋 */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center md:justify-start gap-2">
                  <span>Welcome!</span>
                  <span className="text-2xl sm:text-3xl">👋</span>
                </h2>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Nick Field (With reddish border as shown in 1st pic) */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="nick-input" className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Nick
                  </label>
                  <input
                    id="nick-input"
                    type="text"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                    maxLength={24}
                    required
                    placeholder="Enter nickname"
                    className="w-full px-3 py-2 rounded-xs border border-[#d9534f] dark:border-rose-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 transition-all font-medium"
                    autoFocus
                  />
                </div>

                {/* Checkbox: I have a password */}
                <div className="space-y-2 text-left">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700 dark:text-zinc-300 select-none">
                    <input
                      type="checkbox"
                      checked={hasPassword}
                      onChange={(e) => setHasPassword(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 text-[#5ec5a4] focus:ring-[#5ec5a4] w-3.5 h-3.5"
                    />
                    <span>I have a password</span>
                  </label>

                  {/* Optional Password Input if checked */}
                  {hasPassword && (
                    <div className="pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="NickServ password"
                        className="w-full px-3 py-1.5 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Mint Green / Teal Start Button (Exact color & shape in 1st pic) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-6 rounded-xs bg-[#72c7ab] hover:bg-[#5db89a] active:bg-[#4ea88c] text-white font-bold text-sm tracking-wide transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Start</span>
                  </button>
                </div>

              </form>

              {/* Quick tip */}
              <p className="text-[11px] text-zinc-400 text-center md:text-left leading-tight">
                No registration required to chat. Registered nicknames can identify with password.
              </p>

            </div>

          </div>

          {/* Green Vertical Divider Line (Exact green accent line in 1st pic) */}
          <div className="hidden md:block w-1 bg-[#10b981] dark:bg-emerald-500 self-stretch shrink-0" />

          {/* Right Column: Monochrome Heritage Cityscape (Exact photograph in 1st pic) */}
          <div className="w-full md:w-[58%] relative min-h-[300px] md:min-h-full bg-zinc-900 overflow-hidden select-none">
            
            {/* High contrast black & white photograph matching the Salzburg/European architecture view in pic 1 */}
            <img
              src="https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80"
              alt="Historic Cityscape Architecture"
              className="w-full h-full object-cover grayscale contrast-125 brightness-95"
              loading="lazy"
            />
            
            {/* Subtle monochrome tint layer */}
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />

          </div>

        </div>

        {/* Bottom Bar: Fullscreen Mode Trigger (Matching 1st pic text) */}
        <div className="flex items-center justify-center pt-1">
          <button
            onClick={onToggleFullscreen}
            type="button"
            className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline flex items-center gap-1.5 transition-colors py-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Open in fullscreen mode</span>
          </button>
        </div>

        {/* Embed Chat Widget Section (Requested by user) */}
        <div className="mt-8 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Embed Chat Widget to Your Website
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Copy and paste this HTML code directly into your website or blog to embed this live chatroom:
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyEmbed}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5ec5a4] hover:bg-[#4db292] active:scale-95 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              {copiedEmbed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Embed Code</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-3.5 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-zinc-800 select-all leading-relaxed">
              <code>{embedCodeSnippet}</code>
            </pre>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full microphone, camera, and display-capture support enabled</span>
            </div>
            <button
              onClick={onOpenEmbedModal}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              More embed options & custom dimensions →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
