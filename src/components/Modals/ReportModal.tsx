import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment or Bullying', desc: 'Threats, insult, hate speech, or persistent unwanted advances.' },
  { id: 'inappropriate', label: 'Inappropriate Content', desc: 'Sexually explicit text, obscene content, or graphic material.' },
  { id: 'underage', label: 'Suspected Underage User', desc: 'User appears to be under 18 years of age.' },
  { id: 'spam', label: 'Spam or Commercial Promotion', desc: 'Bot activity, advertising links, or crypto/scam solicitation.' },
  { id: 'other', label: 'Other Violations', desc: 'Any other violation of community guidelines.' },
];

export const ReportModal: React.FC = () => {
  const { reportStranger, setActiveModal } = useChat();
  const [selectedReason, setSelectedReason] = useState<string>('harassment');
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportStranger(selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setActiveModal('none');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-500">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Report & Block Stranger</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Help maintain a safe community.
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

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Report Submitted</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Thank you for reporting. The stranger has been blocked and session disconnected.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Select Reason
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start p-3 rounded-2xl border cursor-pointer transition-colors ${
                      selectedReason === r.id
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={() => setSelectedReason(r.id)}
                      className="mt-0.5 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div className="ml-3">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{r.label}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide brief context if necessary..."
                rows={2}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Submitting a report will instantly disconnect the stranger and add them to your block list.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
              >
                Submit & Block Stranger
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
