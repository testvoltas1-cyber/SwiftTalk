import React from 'react';
import { Settings, X, Volume2, VolumeX, Eye, EyeOff, ShieldOff, Sun, Moon, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const SettingsModal: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    blockedUsersCount,
    unblockAllUsers,
    setActiveModal,
    screenshotProtection,
    toggleScreenshotProtection,
  } = useChat();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Preferences & Security</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Customize audio, privacy filters, and anti-screenshot security.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Telegram Anti-Screenshot & Screen Capture Protection Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50">
            <div className="flex items-center space-x-3">
              {screenshotProtection ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-zinc-400" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Anti-Screenshot Shield</p>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                    Telegram Security
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Blocks PrintScreen, snipping tools, and captures on private photos & chat
                </p>
              </div>
            </div>
            <button
              onClick={toggleScreenshotProtection}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                screenshotProtection ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  screenshotProtection ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center space-x-3">
              {preferences.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-zinc-400" />
              )}
              <div>
                <p className="text-xs font-bold">Sound Effects</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Play audio chime on message send and receive</p>
              </div>
            </div>
            <button
              onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                preferences.soundEnabled ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  preferences.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Profanity Blur Filter Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center space-x-3">
              {preferences.blurProfanity ? (
                <EyeOff className="w-5 h-5 text-emerald-500" />
              ) : (
                <Eye className="w-5 h-5 text-zinc-400" />
              )}
              <div>
                <p className="text-xs font-bold">Blur Profanity</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Censor sensitive profanity words in messages</p>
              </div>
            </div>
            <button
              onClick={() => updatePreferences({ blurProfanity: !preferences.blurProfanity })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                preferences.blurProfanity ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  preferences.blurProfanity ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto Next on Report Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center space-x-3">
              <ShieldOff className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs font-bold">Auto Next Stranger on Report</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Automatically search for next stranger after reporting</p>
              </div>
            </div>
            <button
              onClick={() => updatePreferences({ autoNextOnReport: !preferences.autoNextOnReport })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                preferences.autoNextOnReport ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  preferences.autoNextOnReport ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Theme Selection */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center space-x-3">
              {preferences.theme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <p className="text-xs font-bold">Theme Mode</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Toggle dark or light theme</p>
              </div>
            </div>
            <div className="flex bg-zinc-200 dark:bg-zinc-700 p-1 rounded-xl">
              <button
                onClick={() => updatePreferences({ theme: 'light' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  preferences.theme === 'light' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => updatePreferences({ theme: 'dark' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  preferences.theme === 'dark' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-400'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Blocked Users Count & Reset */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold">Blocked Strangers List</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {blockedUsersCount} blocked peers in local storage
              </p>
            </div>
            {blockedUsersCount > 0 && (
              <button
                onClick={unblockAllUsers}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear List</span>
              </button>
            )}
          </div>

        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={() => setActiveModal('none')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            Save & Done
          </button>
        </div>

      </div>
    </div>
  );
};
