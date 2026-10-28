import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';
import { RoutineItem, Category } from '../types';
import { translations } from '../utils/translations';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<RoutineItem, 'id' | 'isCompleted' | 'order'> & { id?: string }) => void;
  initialItem?: RoutineItem | null;
  categories: Category[];
  language: 'hi' | 'en';
}

const COMMON_EMOJIS = ['🌅', '🧘', '🏃', '🍳', '☕', '💻', '💼', '🥗', '📞', '📚', '🎯', '🚶', '🍽️', '📖', '😴', '✨'];

export const RoutineModal: React.FC<RoutineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  categories,
  language,
}) => {
  const t = translations[language];

  const [time, setTime] = useState('06:00 AM');
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('🌅');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_health');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setTime(initialItem.time);
      setTitle(initialItem.title);
      setIcon(initialItem.icon || '🌅');
      setCategoryId(initialItem.categoryId);
    } else {
      setTime('07:00 AM');
      setTitle('');
      setIcon('🌅');
      setCategoryId(categories[0]?.id || 'cat_health');
    }
    setError('');
  }, [initialItem, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(language === 'hi' ? 'कृपया कार्य का नाम लिखें' : 'Please enter an activity name');
      return;
    }

    onSave({
      id: initialItem?.id,
      time: time.trim(),
      title: title.trim(),
      icon,
      categoryId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-amber-500 rounded-full" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {initialItem ? t.modal.editRoutineSlot : t.modal.addRoutineSlot}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Time input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Clock size={14} className="text-amber-500" />
              {t.modal.time}
            </label>
            <input
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="06:00 AM"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Activity title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {t.modal.titleLabel} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.modal.titlePlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Emoji selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {t.modal.iconEmoji}
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition ${
                    icon === emoji
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 scale-110 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {t.modal.category}
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                    categoryId === cat.id
                      ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {t.tasks.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition transform active:scale-95"
            >
              {initialItem ? t.modal.updateTask : t.modal.saveTask}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
