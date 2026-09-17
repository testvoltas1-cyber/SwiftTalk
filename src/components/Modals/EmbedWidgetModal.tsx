import React, { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink, ShieldCheck, Eye } from 'lucide-react';

interface EmbedWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChannel?: string;
}

export const EmbedWidgetModal: React.FC<EmbedWidgetModalProps> = ({
  isOpen,
  onClose,
  defaultChannel = 'chatindian',
}) => {
  const [selectedChannel, setSelectedChannel] = useState(defaultChannel.replace(/^#/, ''));
  const [widgetHeight, setWidgetHeight] = useState(600);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const embedCode = `<iframe src="https://kiwiirc.hybridirc.com/#${selectedChannel}" allow="microphone; camera; display-capture; fullscreen" style="border:0; width:100%; height:${widgetHeight}px;"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = embedCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Embed ChatIndian Widget to Your Website
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Add free live ChatIndian chat directly to any blog, forum, or website
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Options: Channel and Height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Target Channel
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="chatindian">#chatindian (Default / Active)</option>
                <option value="allindiachat.com">#allindiachat.com</option>
                <option value="India">#India</option>
                <option value="trivia">#trivia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Widget Height (px)
              </label>
              <div className="flex items-center gap-2">
                {[500, 600, 700].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setWidgetHeight(h)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      widgetHeight === h
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {h}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                HTML Embed Code
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Embed Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative group">
              <pre className="p-4 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-zinc-800 leading-relaxed shadow-inner">
                <code>{embedCode}</code>
              </pre>
            </div>
          </div>

          {/* Features note */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Features Included:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-zinc-600 dark:text-zinc-400 text-[11px]">
              <li>Microphone, camera, and display-capture permissions allowed for media features</li>
              <li>Responsive 100% fluid width adapting to any container or mobile screen</li>
              <li>Connects securely over SSL/TLS to hybridirc.com network</li>
            </ul>
          </div>

          {/* Toggle Live Preview */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Hide Widget Preview' : 'Show Widget Live Preview'}</span>
            </button>

            {showPreview && (
              <div className="mt-3 rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950">
                <iframe
                  src={`https://kiwiirc.hybridirc.com/#${selectedChannel}`}
                  allow="microphone; camera; display-capture; fullscreen"
                  style={{ border: 0, width: '100%', height: '400px' }}
                  title="KiwiIRC Preview"
                />
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Powered by HybridIRC & KiwiIRC</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
