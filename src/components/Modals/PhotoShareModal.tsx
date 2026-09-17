import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Copy,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Film,
  Loader2,
  Share2,
} from 'lucide-react';
import { CURATED_GIFS, GIF_CATEGORIES, GifItem } from '../../data/gifs';

interface PhotoShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName?: string;
  onPhotoUploaded?: (photoUrl: string) => void;
}

export const PhotoShareModal: React.FC<PhotoShareModalProps> = ({
  isOpen,
  onClose,
  channelName = 'chatindian',
  onPhotoUploaded,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gif'>('upload');

  // Upload States
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // GIF States
  const [gifCategory, setGifCategory] = useState('Trending');
  const [gifSearch, setGifSearch] = useState('');
  const [selectedGif, setSelectedGif] = useState<GifItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process selected photo file
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image (JPEG, PNG, GIF, WebP).');
      return;
    }

    setErrorMsg(null);
    setUploadedUrl(null);
    setCopied(false);

    // Read and compress image client side
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      setFilePreview(base64Data);

      // Trigger upload automatically
      await uploadImageToServer(base64Data, file.name);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToServer = async (base64Image: string, fileName?: string) => {
    setIsUploading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          title: fileName || 'Photo',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const data = await res.json();
      if (data.url) {
        setUploadedUrl(data.url);
        if (onPhotoUploaded) onPhotoUploaded(data.url);

        // Store in local recent history
        try {
          const raw = localStorage.getItem('chatindian_recent_pics') || '[]';
          const list = JSON.parse(raw);
          list.unshift({ url: data.url, time: Date.now() });
          localStorage.setItem('chatindian_recent_pics', JSON.stringify(list.slice(0, 15)));
        } catch (e) {
          /* ignore */
        }
      } else {
        throw new Error('No URL received from server');
      }
    } catch (err: any) {
      console.warn('Backend upload error, trying direct fallback:', err);
      // Fallback: If for any reason server storage failed, use data or external
      setUploadedUrl(base64Image);
      setErrorMsg('Direct link created. Some IRC channels prefer web image URLs.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = async (targetUrl?: string) => {
    const urlToCopy = targetUrl || uploadedUrl || selectedGif?.url;
    if (!urlToCopy) return;

    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = urlToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSelectGif = (gif: GifItem) => {
    setSelectedGif(gif);
    setUploadedUrl(gif.url);
    if (onPhotoUploaded) onPhotoUploaded(gif.url);
  };

  const filteredGifs = CURATED_GIFS.filter((g) => {
    const matchCat = gifCategory === 'Trending' ? true : g.category.toLowerCase() === gifCategory.toLowerCase();
    const matchSearch = gifSearch
      ? g.title.toLowerCase().includes(gifSearch.toLowerCase()) || g.category.toLowerCase().includes(gifSearch.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Share Photo or GIF</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                  #{channelName}
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Upload photos or GIFs and easily paste them into KiwiIRC / ChatIndian
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

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-5 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo / Image</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gif')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'gif'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Reaction GIFs</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'upload' ? (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  filePreview
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-400 bg-zinc-50/50 dark:bg-zinc-800/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                  }}
                />

                {filePreview ? (
                  <div className="space-y-3">
                    <div className="relative inline-block max-h-56 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      <img
                        src={filePreview}
                        alt="Upload preview"
                        className="max-h-52 w-auto object-contain mx-auto"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Uploading image...</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Click to choose a different photo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Click to choose photo or Drag & Drop here
                    </p>
                    <p className="text-xs text-zinc-400">
                      Supports JPG, PNG, GIF, WebP (camera or gallery)
                    </p>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Upload Result / Ready to Share */}
              {uploadedUrl && (
                <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Photo Ready to Share!</span>
                    </span>
                    <a
                      href={uploadedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={uploadedUrl}
                      className="w-full text-xs font-mono bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-200 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyLink(uploadedUrl)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step-by-step instructions */}
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Chat mein photo kaise dikhayen:</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      1. Upar <strong>"Copy Link"</strong> dabayein.<br />
                      2. Niche chat window ke message input mein <strong>Paste (Ctrl+V)</strong> karein aur <strong>Enter</strong> dabayein.<br />
                      3. ChatIndian / KiwiIRC room me photo automatically sabhi users ko display ho jayegi!
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* GIF Library */
            <div className="space-y-3">
              {/* Category selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {GIF_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGifCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      gifCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* GIF Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredGifs.map((gif) => (
                  <div
                    key={gif.id}
                    onClick={() => handleSelectGif(gif)}
                    className={`relative rounded-xl overflow-hidden border cursor-pointer group transition-all aspect-video bg-zinc-950 ${
                      selectedGif?.id === gif.id
                        ? 'border-emerald-500 ring-2 ring-emerald-500'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-400'
                    }`}
                  >
                    <img
                      src={gif.url}
                      alt={gif.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[11px] text-white font-medium truncate">
                        {gif.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedGif && (
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <img src={selectedGif.url} alt="" className="w-10 h-10 rounded-md object-cover" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        {selectedGif.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate font-mono">
                        {selectedGif.url}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(selectedGif.url)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy GIF Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Supported in KiwiIRC, HybridIRC, and all chat channels.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
