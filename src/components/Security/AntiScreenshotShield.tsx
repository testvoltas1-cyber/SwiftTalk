import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Lock, EyeOff } from 'lucide-react';

interface AntiScreenshotShieldProps {
  children?: React.ReactNode;
  enabled?: boolean;
}

export const AntiScreenshotShield: React.FC<AntiScreenshotShieldProps> = ({
  children,
  enabled = true,
}) => {
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [alertReason, setAlertReason] = useState('Screenshot attempt blocked');

  useEffect(() => {
    if (!enabled) return;

    // Inject print protection CSS
    const style = document.createElement('style');
    style.id = 'anti-screenshot-styles';
    style.innerHTML = `
      @media print {
        body * {
          display: none !important;
        }
        body::before {
          content: "⚠️ ChatIndian Security: Screenshots and printing are strictly prohibited to safeguard user privacy.";
          font-size: 20px;
          font-weight: bold;
          color: red;
          display: block;
          padding: 40px;
          text-align: center;
        }
      }
      .no-select {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);

    const triggerAlert = (reason: string) => {
      setAlertReason(reason);
      setShowSecurityAlert(true);
      setTimeout(() => {
        setShowSecurityAlert(false);
      }, 4000);
    };

    // Only detect actual screenshot key combinations
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        triggerAlert('PrintScreen / Screenshot shortcut detected & blocked');
      }

      // Windows Snipping Tool (Win + Shift + S) or Mac (Cmd + Shift + 3 / 4)
      if (
        (e.shiftKey && (e.metaKey || e.ctrlKey) && ['S', 's', '3', '4', '5'].includes(e.key)) ||
        (e.ctrlKey && e.key.toLowerCase() === 'p') ||
        (e.metaKey && e.key.toLowerCase() === 'p')
      ) {
        e.preventDefault();
        triggerAlert('Screen capture or print shortcut blocked');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('');
          }
        } catch (err) {
          // ignore clipboard write errors
        }
        triggerAlert('Screenshot prevented • Clipboard wiped');
      }
    };

    // Disable right click context menu on protected areas
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-chat-content')) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('contextmenu', handleContextMenu);
      const s = document.getElementById('anti-screenshot-styles');
      if (s) s.remove();
    };
  }, [enabled]);

  return (
    <>
      {/* Alert Banner / Toast when capture is detected */}
      {showSecurityAlert && (
        <div className="fixed top-5 inset-x-0 z-[9999] flex justify-center px-4 pointer-events-none animate-in slide-in-from-top duration-300">
          <div className="bg-rose-600 text-white px-4 py-3 rounded-2xl shadow-2xl border border-rose-400 flex items-center gap-3 max-w-md pointer-events-auto">
            <div className="p-2 rounded-xl bg-white/20 shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Screenshot & Capture Protected
              </p>
              <p className="text-xs text-rose-100 mt-0.5">
                {alertReason}. Private messages & ephemeral media cannot be captured.
              </p>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
};
