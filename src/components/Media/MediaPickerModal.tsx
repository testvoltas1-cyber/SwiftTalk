import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Flame,
  Search,
  Upload,
  Send,
  Sparkles,
  Timer,
  Check,
  AlertCircle,
  Film,
} from 'lucide-react';
import { CURATED_GIFS, GIF_CATEGORIES, GifItem } from '../../data/gifs';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMedia: (payload: {
    mediaType: 'photo' | 'gif';
    mediaUrl: string;
    caption?: string;
    ephemeralTimer?: number;
  }) => void;
  title?: string;
}

const TIMER_OPTIONS = [
  { label: 'Default (10m Auto-Clean)', value: undefined, icon: '⏱️', desc: 'Auto-deleted after 10m to save storage' },
  { label: '5 Seconds (View-Once)', value: 5, icon: '🔥', desc: 'Disappears 5s after recipient views it' },
  { label: '10 Seconds', value: 10, icon: '🔥', desc: 'Disappears 10s after recipient views it' },
  { label: '30 Seconds', value: 30, icon: '⏱️', desc: 'Disappears 30s after recipient views it' },
  { label: '1 Minute', value: 60, icon: '⏱️', desc: 'Disappears 1m after recipient views it' },
  { label: '5 Minutes', value: 300, icon: '⏱️', desc: 'Disappears 5m after recipient views it' },
];

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSendMedia,
  title = 'Send Photo or GIF',
}) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'gif'>('photo');

  // Photo State
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // GIF State
  const [selectedGif, setSelectedGif] = useState<GifItem | null>(null);
  const [gifSearch, setGifSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Trending');

  // Ephemeral Timer
  const [selectedTimer, setSelectedTimer] = useState<number | undefined>(undefined);
  const [showTimerDropdown, setShowTimerDropdown] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Compress image to canvas data URL
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP, GIF).');
      return;
    }

    setErrorMessage(null);
    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 960;
        const MAX_HEIGHT = 960;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setPhotoDataUrl(compressed);
        } else {
          setPhotoDataUrl(e.target?.result as string);
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        setIsCompressing(false);
        setErrorMessage('Failed to process the selected image.');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setIsCompressing(false);
      setErrorMessage('Could not read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSend = () => {
    if (activeTab === 'photo') {
      if (!photoDataUrl) return;
      onSendMedia({
        mediaType: 'photo',
        mediaUrl: photoDataUrl,
        caption: photoCaption.trim() || undefined,
        ephemeralTimer: selectedTimer,
      });
    } else {
      if (!selectedGif) return;
      onSendMedia({
        mediaType: 'gif',
        mediaUrl: selectedGif.url,
        caption: photoCaption.trim() || undefined,
        ephemeralTimer: selectedTimer,
      });
    }

    // Reset & Close
    setPhotoDataUrl(null);
    setSelectedGif(null);
    setPhotoCaption('');
    setSelectedTimer(undefined);
    onClose();
  };

  const filteredGifs = CURATED_GIFS.filter((g) => {
    const matchesCat = selectedCategory === 'Trending' ? true : g.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = gifSearch
      ? g.title.toLowerCase().includes(gifSearch.toLowerCase()) || g.category.toLowerCase().includes(gifSearch.toLowerCase())
      : true;
    return matchesCat && matchesSearch;
  });

  const currentTimerLabel = TIMER_OPTIONS.find((t) => t.value === selectedTimer)?.label || '10m Auto-Clean (Default)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              {activeTab === 'photo' ? <ImageIcon className="w-5 h-5" /> : <Film className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Encrypted & Ephemeral Media Sharing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/40 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'photo'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gif')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'gif'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Search GIFs</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: PHOTO */}
          {activeTab === 'photo' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {!photoDataUrl ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/30 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Click to browse or drag & drop photo
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Supports JPG, PNG, WebP, GIF (Compressed client-side)
                  </p>
                  {isCompressing && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-2 animate-pulse">
                      Compressing & Optimizing image...
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-950 flex items-center justify-center max-h-64 group">
                    <img
                      src={photoDataUrl}
                      alt="Selected"
                      className="max-h-60 w-auto object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Add an optional caption..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GIFS */}
          {activeTab === 'gif' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={gifSearch}
                  onChange={(e) => setGifSearch(e.target.value)}
                  placeholder="Search popular GIFs (funny, reaction, love...)"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {GIF_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setGifSearch('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Selected GIF Preview */}
              {selectedGif && (
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={selectedGif.previewUrl}
                      alt={selectedGif.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        Selected: {selectedGif.title}
                      </p>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        Ready to send
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedGif(null)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* GIF Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
                {filteredGifs.map((gif) => {
                  const isChosen = selectedGif?.id === gif.id;
                  return (
                    <button
                      key={gif.id}
                      type="button"
                      onClick={() => setSelectedGif(gif)}
                      className={`relative rounded-xl overflow-hidden aspect-square border transition-all hover:scale-105 cursor-pointer ${
                        isChosen
                          ? 'border-indigo-600 ring-2 ring-indigo-500 shadow-md'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'
                      }`}
                    >
                      <img
                        src={gif.previewUrl}
                        alt={gif.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isChosen && (
                        <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TELEGRAM-LIKE SELF-DESTRUCT TIMER SELECTOR */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Self-Destruct Timer (Telegram Security)</span>
              </label>
              <span className="text-[10px] text-zinc-400">Auto-destruct after viewing</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {TIMER_OPTIONS.map((opt) => {
                const isSelected = selectedTimer === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedTimer(opt.value)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold shadow-xs'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-zinc-400">
              {selectedTimer
                ? `⚡ Recipient will only have ${selectedTimer}s to view this media once opened.`
                : '🛡️ Storage Protection: Unopened or opened media automatically purges from memory after 10 minutes.'}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/40 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={activeTab === 'photo' ? !photoDataUrl : !selectedGif}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
            <span>Send {activeTab === 'photo' ? 'Photo' : 'GIF'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
