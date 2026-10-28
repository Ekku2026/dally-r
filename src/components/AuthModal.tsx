import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { translations } from '../utils/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  language: 'hi' | 'en';
}

const AVATAR_OPTIONS = ['👨‍💼', '👩‍💼', '🧑‍🎓', '👨‍💻', '👩‍💻', '🧘‍♂️', '🏃‍♀️', '🦁', '⭐', '⚡'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  language,
}) => {
  const t = translations[language];

  const [tab, setTab] = useState<'login' | 'signup' | 'profile'>('profile');
  const [name, setName] = useState(currentProfile.name);
  const [email, setEmail] = useState(currentProfile.email);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(currentProfile.avatar || '👨‍💼');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      onSaveProfile({
        id: `user_${Date.now()}`,
        name: name || email.split('@')[0] || 'User',
        email,
        avatar,
        isGuest: false,
      });
      setStatusMsg(language === 'hi' ? 'सफलतापूर्वक लॉगिन हो गया!' : 'Successfully signed in!');
      setTimeout(onClose, 800);
    } else if (tab === 'signup') {
      onSaveProfile({
        id: `user_${Date.now()}`,
        name: name || 'User',
        email,
        avatar,
        isGuest: false,
      });
      setStatusMsg(language === 'hi' ? 'नया खाता सफलतापूर्वक बन गया!' : 'Account created successfully!');
      setTimeout(onClose, 800);
    } else {
      onSaveProfile({
        ...currentProfile,
        name: name.trim() || currentProfile.name,
        email: email.trim() || currentProfile.email,
        avatar,
      });
      setStatusMsg(language === 'hi' ? 'प्रोफ़ाइल अपडेट हो गई!' : 'Profile updated!');
      setTimeout(onClose, 800);
    }
  };

  const handleGuestMode = () => {
    onSaveProfile({
      id: 'guest_user',
      name: language === 'hi' ? 'अतिथि यूज़र' : 'Guest User',
      email: 'guest@dailyroutine.local',
      avatar: '👤',
      isGuest: true,
    });
    setStatusMsg(language === 'hi' ? 'गेस्ट मोड सक्रिय!' : 'Guest mode active!');
    setTimeout(onClose, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex gap-2">
            <button
              onClick={() => { setTab('profile'); setStatusMsg(''); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                tab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {t.settings.editProfile}
            </button>
            <button
              onClick={() => { setTab('login'); setStatusMsg(''); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                tab === 'login'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              लॉगिन (Sign In)
            </button>
            <button
              onClick={() => { setTab('signup'); setStatusMsg(''); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                tab === 'signup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              साइन अप (Sign Up)
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {statusMsg && (
            <div className="flex items-center gap-2 p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900">
              <CheckCircle2 size={16} />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              अवतार चुनें (Avatar)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl border transition ${
                    avatar === av
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <User size={14} className="text-indigo-500" />
              नाम (Full Name)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ekant Patel"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Mail size={14} className="text-indigo-500" />
              ईमेल (Email Address)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password (if login or signup) */}
          {tab !== 'profile' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Lock size={14} className="text-indigo-500" />
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              {tab === 'login' ? 'लॉगिन करें' : tab === 'signup' ? 'नया खाता बनाएं' : 'प्रोफ़ाइल सहेजें'}
            </button>

            <button
              type="button"
              onClick={handleGuestMode}
              className="w-full py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={14} className="text-slate-400" />
              बिना पासवर्ड गेस्ट मोड में उपयोग करें (Guest Mode)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
