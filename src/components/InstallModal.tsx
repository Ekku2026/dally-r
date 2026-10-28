import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Copy,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hi' | 'en';
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-indigo-600 rounded-full" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Smartphone size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'ऐप / APK इंस्टॉल करें' : 'Install App / APK'}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* App Preview Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-400 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">Daily Routine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'दैनिक कार्य और दिनचर्या प्रबंधक — ऑफ़लाइन और मोबाइल फ्रेंडली'
                  : 'Daily Task & Routine Manager — Offline & Mobile Ready'}
              </p>
            </div>
          </div>

          {/* Option 1: Native 1-Click Install Button (When prompt is ready) */}
          {isInstallable && (
            <div className="p-4 rounded-2xl border-2 border-indigo-500 bg-white dark:bg-slate-800/80 shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {language === 'hi' ? 'सीधे मोबाइल में इंस्टॉल करें' : 'Direct 1-Click Install'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'hi'
                      ? 'Android आपके फोन पर असली WebAPK इंस्टॉल करेगा'
                      : 'Installs as a standalone native app on your phone'}
                  </p>
                </div>
                <button
                  onClick={handleDirectInstall}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <Download size={15} />
                  <span>{language === 'hi' ? 'इंस्टॉल करें' : 'Install Now'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Option 2: Android Chrome Install Steps */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>{language === 'hi' ? 'Android फोन पर इंस्टॉल करने का तरीका' : 'How to Install on Android Phone'}</span>
            </h4>
            <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                {language === 'hi' ? (
                  <>इस ऐप लिंक को अपने फोन के <strong>Google Chrome</strong> ब्राउज़र में खोलें।</>
                ) : (
                  <>Open this link in your phone's <strong>Google Chrome</strong> browser.</>
                )}
              </li>
              <li>
                {language === 'hi' ? (
                  <>ऊपर दाईं ओर <strong>तीन बिंदुओं (⋮ Menu)</strong> पर टैप करें।</>
                ) : (
                  <>Tap the <strong>three dots (⋮ Menu)</strong> in top-right corner.</>
                )}
              </li>
              <li>
                {language === 'hi' ? (
                  <><strong>"Install app"</strong> या <strong>"Add to Home screen" (होम स्क्रीन पर जोड़ें)</strong> पर क्लिक करें।</>
                ) : (
                  <>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</>
                )}
              </li>
              <li>
                {language === 'hi' ? (
                  <>Android तुरंत आपके मोबाइल में <strong>Daily Routine APK</strong> ऐप इंस्टॉल कर देगा!</>
                ) : (
                  <>Android will generate and install the native <strong>Daily Routine WebAPK</strong> on your phone!</>
                )}
              </li>
            </ol>
          </div>

          {/* Option 3: Direct APK Builder File Generation */}
          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
            <h4 className="font-bold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Download size={14} className="text-amber-600" />
              <span>{language === 'hi' ? 'सीधे .APK फ़ाइल डाउनलोड करना चाहते हैं?' : 'Want a standalone .APK file?'}</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'Microsoft का PWABuilder इस ऐप URL से 1 मिनट में साइन्ड Android APK फ़ाइल पैकेज बनाकर डाउनलोड करने देता है:'
                : 'You can generate a signed standalone Android APK package using PWABuilder:'}
            </p>
            <a
              href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition active:scale-95 mt-1"
            >
              <span>{language === 'hi' ? 'PWABuilder से APK बनाएं →' : 'Build .APK on PWABuilder →'}</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Copy Shareable Link */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {language === 'hi' ? 'ऐप का लाइव लिंक (App Live Link)' : 'App Live Link'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shrink-0"
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                <span>{copied ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
