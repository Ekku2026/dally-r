import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Download,
  ExternalLink,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadApkPageProps {
  language: 'hi' | 'en';
  onBackToApp: () => void;
}

export const DownloadApkPage: React.FC<DownloadApkPageProps> = ({
  language,
  onBackToApp,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const sharedAppUrl = 'https://ais-pre-c7hwhekwerlvzvqfiou72y-216104213775.asia-east1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(sharedAppUrl)}`;

  useEffect(() => {
    QRCode.toDataURL(sharedAppUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#312e81',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Error generating QR Code', err));
  }, [sharedAppUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectInstall = async () => {
    await install();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-amber-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/20 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
              <Smartphone size={14} />
              <span>{language === 'hi' ? 'Android APK डाउनलोड हब' : 'Android APK Download Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'hi' ? 'Daily Routine Android APK प्राप्त करें' : 'Get Daily Routine Android APK'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-2 max-w-lg">
              {language === 'hi'
                ? 'अपने Android स्मार्टफोन में 1-क्लिक में आधिकारिक WebAPK ऐप इंस्टॉल करें या सीधे .APK फाइल बनाएं।'
                : 'Install the official WebAPK directly on your Android phone or package a standalone .APK.'}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white text-indigo-700 flex items-center justify-center font-black text-3xl shadow-lg shrink-0">
            ✓
          </div>
        </div>
      </div>

      {/* Primary Action Card: Direct 1-Click Install or Link */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              <span>{language === 'hi' ? 'तरीका 1: मोबाइल में डायरेक्ट इंस्टॉल (अनुशंसित)' : 'Method 1: Direct Mobile Install (Recommended)'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'hi'
                ? 'Google Chrome अपने आप Android के लिए आधिकारिक WebAPK बनाता है जो बिना ब्राउज़र बार के फुल स्क्रीन ऐप की तरह काम करता है।'
                : 'Android automatically creates an official WebAPK that runs as a full-screen native mobile application.'}
            </p>
          </div>

          {isInstallable ? (
            <button
              onClick={handleDirectInstall}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 transition active:scale-95 shrink-0 flex items-center gap-2"
            >
              <Download size={18} />
              <span>{language === 'hi' ? 'अभी APK इंस्टॉल करें' : 'Install APK Now'}</span>
            </button>
          ) : (
            <a
              href={sharedAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 transition active:scale-95 shrink-0 flex items-center gap-2"
            >
              <ExternalLink size={18} />
              <span>{language === 'hi' ? 'फोन में लिंक खोलें' : 'Open in Phone'}</span>
            </a>
          )}
        </div>

        {/* QR Code and Step by Step */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* QR Code Box */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-center">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="App QR Code"
                className="w-48 h-48 rounded-xl shadow-md border-4 border-white"
              />
            ) : (
              <div className="w-48 h-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            )}
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-3">
              {language === 'hi' ? '📷 अपने मोबाइल कैमरे से QR कोड स्कैन करें' : '📷 Scan QR Code with phone camera'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'hi' ? 'सीधे फोन में ऐप खुलेगा और इंस्टॉल हो जाएगा' : 'Directly opens & installs on your smartphone'}
            </p>
          </div>

          {/* 3 Simple Steps */}
          <div className="space-y-3.5 flex flex-col justify-center">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'लिंक को Google Chrome में खोलें' : 'Open URL in Google Chrome'}
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  {language === 'hi'
                    ? 'अपने Android फोन में Chrome या Brave ब्राउज़र में यह लिंक खोलें।'
                    : 'Open this application URL on your Android smartphone.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'Install App (ऐप इंस्टॉल) पर टैप करें' : 'Tap Install App'}
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  {language === 'hi'
                    ? 'ब्राउज़र के ऊपर दाईं ओर 3-डॉट्स (⋮) दबाएं और "Install app" या "होम स्क्रीन में जोड़ें" चुनें।'
                    : 'Tap the 3 dots (⋮) in Chrome and choose "Install app" or "Add to Home screen".'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'फोन में APK तैयार होकर आ जाएगा' : 'WebAPK Ready on Phone'}
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  {language === 'hi'
                    ? 'ऐप ड्रॉअर में Daily Routine का ऐप आइकन बन जाएगा। अब इसे बिना इंटरनेट भी चलाएं!'
                    : 'Your phone will install the native app package, available offline anytime!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Link Field */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {language === 'hi' ? 'ऐप का लाइव डायरेक्ट डाउनलोड लिंक (App Link):' : 'Direct App Link:'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={sharedAppUrl}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shrink-0"
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              <span>{copied ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'कॉपी करें' : 'Copy Link')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Standalone .APK File Generation via PWABuilder */}
      <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Download size={18} className="text-amber-600" />
              <span>{language === 'hi' ? 'तरीका 2: स्टैंडअलोन .APK फ़ाइल पैकेज डाउनलोड करें' : 'Method 2: Standalone .APK Package File Download'}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              {language === 'hi'
                ? 'यदि आपको अन्य फोन में पेनड्राइव या व्हाट्सएप से भेजने के लिए अलग से .apk फाइल चाहिए, तो Microsoft PWABuilder से 1 मिनट में साइन्ड Android APK पैकेज डाउनलोड करें:'
                : 'If you want a standalone raw .apk file to distribute or install via APK installer, use PWABuilder to generate the package in 1 minute:'}
            </p>
          </div>

          <a
            href={pwaBuilderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 transition active:scale-95 shrink-0 flex items-center gap-2"
          >
            <span>{language === 'hi' ? 'PWABuilder से .APK बनाएं' : 'Build .APK via PWABuilder'}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Back to App button */}
      <div className="text-center pt-2">
        <button
          onClick={onBackToApp}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          <span>{language === 'hi' ? '← मुख्य ऐप (Dashboard) पर वापस जाएं' : '← Return to Dashboard'}</span>
        </button>
      </div>
    </div>
  );
};
