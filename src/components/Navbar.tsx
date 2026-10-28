import React from 'react';
import { Sun, Moon, Plus, Sparkles, Languages, CheckSquare, Download } from 'lucide-react';
import { UserProfile, UserSettings } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  profile: UserProfile;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onOpenTaskModal: () => void;
  onOpenAuthModal: () => void;
  onOpenInstallModal: () => void;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  settings,
  onUpdateSettings,
  onOpenTaskModal,
  onOpenAuthModal,
  onOpenInstallModal,
  streakDays,
}) => {
  const t = translations[settings.language];

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  const toggleLanguage = () => {
    const nextLang = settings.language === 'hi' ? 'en' : 'hi';
    onUpdateSettings({ language: nextLang });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <CheckSquare size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 dark:from-indigo-400 dark:to-indigo-200 bg-clip-text text-transparent">
                Daily Routine
              </span>
              {streakDays > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
                  <span className="animate-flame">🔥</span>
                  <span>{streakDays}d</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title={settings.language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
          >
            <Languages size={15} className="text-indigo-500" />
            <span>{settings.language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {settings.theme === 'dark' ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-slate-600" />
            )}
          </button>

          {/* Install App / APK Button */}
          <button
            onClick={onOpenInstallModal}
            title={settings.language === 'hi' ? 'ऐप / APK इंस्टॉल करें' : 'Install App / APK'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 text-xs font-bold hover:bg-amber-500 hover:text-white transition"
          >
            <Download size={14} className="stroke-[2.5]" />
            <span className="hidden sm:inline">{settings.language === 'hi' ? 'ऐप इंस्टॉल (APK)' : 'Install APK'}</span>
          </button>

          {/* Quick Add Task Button (Desktop) */}
          <button
            onClick={onOpenTaskModal}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition transform active:scale-95"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>{t.nav.addTask}</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenAuthModal}
            title={profile.name}
            className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <span className="text-xl leading-none">{profile.avatar || '👨‍💼'}</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[80px] truncate hidden md:block">
              {profile.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
