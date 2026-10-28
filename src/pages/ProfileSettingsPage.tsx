import React, { useRef, useState } from 'react';
import {
  User,
  Sun,
  Moon,
  Laptop,
  Languages,
  Bell,
  Volume2,
  Calendar,
  Download,
  Upload,
  Trash2,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Smartphone,
} from 'lucide-react';
import { UserProfile, UserSettings } from '../types';
import { translations } from '../utils/translations';
import { exportAppData, importAppData, resetAllData } from '../utils/storage';
import { playChimeSound } from '../utils/confetti';

interface ProfileSettingsPageProps {
  profile: UserProfile;
  settings: UserSettings;
  language: 'hi' | 'en';
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onOpenAuthModal: () => void;
  onResetData: () => void;
  onRefreshAllData: () => void;
  onOpenInstallModal: () => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  profile,
  settings,
  language,
  onUpdateSettings,
  onOpenAuthModal,
  onResetData,
  onRefreshAllData,
  onOpenInstallModal,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toastMsg, setToastMsg] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleExport = () => {
    exportAppData();
    triggerToast(t.settings.exportedSuccess);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importAppData(content);
      if (ok) {
        onRefreshAllData();
        triggerToast(t.settings.importedSuccess);
      } else {
        alert(language === 'hi' ? 'अमान्य बैकअप फाइल!' : 'Invalid backup file!');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        onUpdateSettings({ notificationsEnabled: true });
        new Notification('Daily Routine', {
          body: language === 'hi' ? 'सूचनाएं सफलतापूर्वक सक्रिय हो गई हैं!' : 'Notifications enabled successfully!',
          icon: '/favicon.ico',
        });
      } else {
        onUpdateSettings({ notificationsEnabled: false });
      }
    } else {
      alert(language === 'hi' ? 'यह ब्राउज़र नोटिफिकेशन सपोर्ट नहीं करता' : 'Notifications not supported in this browser');
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Toast alert */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl font-bold text-xs animate-in slide-in-from-top duration-300">
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center text-4xl">
              {profile.avatar || '👨‍💼'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {profile.name}
              </h1>
              {profile.isGuest ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {t.settings.guestMode}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{profile.email}</p>
          </div>
        </div>

        <button
          onClick={onOpenAuthModal}
          className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition"
        >
          {t.settings.switchAccount}
        </button>
      </div>

      {/* Preferences Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          {t.settings.preferences}
        </h2>

        {/* Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Sun size={18} />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.settings.theme}</h3>
              <p className="text-[11px] text-slate-400">
                {language === 'hi' ? 'डार्क या लाइट इंटरफेस चुनें' : 'Choose your interface appearance'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                settings.theme === 'light'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sun size={13} />
              <span>{t.settings.light}</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                settings.theme === 'dark'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Moon size={13} />
              <span>{t.settings.dark}</span>
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Languages size={18} />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.settings.language}</h3>
              <p className="text-[11px] text-slate-400">
                {language === 'hi' ? 'हिंदी और अंग्रेज़ी में बदलें' : 'Switch between Hindi and English'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => onUpdateSettings({ language: 'hi' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                settings.language === 'hi'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onUpdateSettings({ language: 'en' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                settings.language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Bell size={18} />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.settings.notifications}</h3>
              <p className="text-[11px] text-slate-400">{t.settings.enableBrowserNotifs}</p>
            </div>
          </div>
          <button
            onClick={requestNotificationPermission}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition ${
              settings.notificationsEnabled
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {settings.notificationsEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Audio chime on task completion */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Volume2 size={18} />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {language === 'hi' ? 'टास्क ऑडियो चाइम' : 'Completion Sound'}
              </h3>
              <p className="text-[11px] text-slate-400">{t.settings.soundChime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => playChimeSound()}
              title="Test Sound"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Play size={14} />
            </button>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition ${
                settings.soundEnabled
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Start of Week */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Calendar size={18} />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.settings.startOfWeek}</h3>
              <p className="text-[11px] text-slate-400">
                {language === 'hi' ? 'कैलेंडर का पहला दिन निर्धारित करें' : 'First day of weekly calendar'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => onUpdateSettings({ startOfWeek: 'monday' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                settings.startOfWeek === 'monday'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              {t.settings.monday}
            </button>
            <button
              onClick={() => onUpdateSettings({ startOfWeek: 'sunday' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                settings.startOfWeek === 'sunday'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              {t.settings.sunday}
            </button>
          </div>
        </div>

        {/* Install Mobile App / APK */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Smartphone size={18} />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <span>{language === 'hi' ? 'मोबाइल ऐप / APK इंस्टॉल करें' : 'Install Mobile App / APK'}</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-bold">PWA</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'hi' ? 'फोन पर सीधे बिना प्ले स्टोर ऐप चलाएं या .APK बनाएं' : 'Install directly to home screen or build .APK'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenInstallModal}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20"
          >
            <Download size={13} />
            <span>{language === 'hi' ? 'इंस्टॉल / डाउनलोड' : 'Install / Download'}</span>
          </button>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          {t.settings.dataManagement}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'आपका सारा डेटा स्थानीय रूप से सुरक्षित है। आप कभी भी बैकअप डाउनलोड या रिस्टोर कर सकते हैं।'
            : 'Your data is securely stored. You can export or restore your routine & tasks anytime.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <Download size={16} className="text-indigo-600" />
            <span>{t.settings.exportBackup}</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <Upload size={16} className="text-amber-500" />
            <span>{t.settings.importBackup}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Clear Data Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition"
          >
            <Trash2 size={14} />
            <span>{t.settings.clearAllData}</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {t.settings.clearAllData}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {t.settings.clearConfirm}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.tasks.cancel}
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  onResetData();
                  setShowClearConfirm(false);
                  triggerToast(language === 'hi' ? 'सारा डेटा साफ़ कर दिया गया' : 'All data cleared');
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25"
              >
                {t.tasks.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
