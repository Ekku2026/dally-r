import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, Bell, Repeat, AlertCircle } from 'lucide-react';
import { Task, Priority, ReminderOption, TaskRepeat, Category } from '../types';
import { translations } from '../utils/translations';
import { getTodayDateString } from '../utils/storage';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'isCompleted'> & { id?: string }) => void;
  initialTask?: Task | null;
  categories: Category[];
  onOpenCategoryModal: () => void;
  language: 'hi' | 'en';
  defaultDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  categories,
  onOpenCategoryModal,
  language,
  defaultDate,
}) => {
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate || getTodayDateString());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_work');
  const [reminder, setReminder] = useState<ReminderOption>('none');
  const [repeat, setRepeat] = useState<TaskRepeat>('none');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDate(initialTask.date);
      setStartTime(initialTask.startTime || '');
      setEndTime(initialTask.endTime || '');
      setPriority(initialTask.priority);
      setCategoryId(initialTask.categoryId);
      setReminder(initialTask.reminder);
      setRepeat(initialTask.repeat);
    } else {
      setTitle('');
      setDescription('');
      setDate(defaultDate || getTodayDateString());
      setStartTime('');
      setEndTime('');
      setPriority('medium');
      setCategoryId(categories[0]?.id || 'cat_work');
      setReminder('none');
      setRepeat('none');
    }
    setError('');
  }, [initialTask, isOpen, defaultDate, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(language === 'hi' ? 'कृपया कार्य का नाम दर्ज करें' : 'Please enter a task title');
      return;
    }

    onSave({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      priority,
      categoryId,
      reminder,
      repeat,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-indigo-600 rounded-full" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {initialTask ? t.modal.editTaskTitle : t.modal.addTaskTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.modal.taskName}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.modal.taskNamePlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-base"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.modal.description}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.modal.descriptionPlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Calendar size={14} className="text-indigo-500" />
                {t.modal.date}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Clock size={14} className="text-indigo-500" />
                {t.modal.startTime}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Clock size={14} className="text-indigo-500" />
                {t.modal.endTime}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {t.modal.priority}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const colors = {
                  low: 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
                  medium: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40',
                  high: 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/40',
                };
                const labels = {
                  low: t.modal.priorityLow,
                  medium: t.modal.priorityMedium,
                  high: t.modal.priorityHigh,
                };
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? `${colors[p]} ring-2 ring-offset-1 ring-slate-400/20 shadow-sm`
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p === 'low' ? 'bg-emerald-500' : p === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selector with New Category action */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Tag size={14} className="text-indigo-500" />
                {t.modal.category}
              </label>
              <button
                type="button"
                onClick={onOpenCategoryModal}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.modal.newCategory}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminder & Repeat Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Bell size={14} className="text-indigo-500" />
                {t.modal.reminder}
              </label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value as ReminderOption)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="none">{t.modal.reminderNone}</option>
                <option value="10m">{t.modal.reminder10m}</option>
                <option value="30m">{t.modal.reminder30m}</option>
                <option value="1h">{t.modal.reminder1h}</option>
                <option value="exact">{t.modal.reminderExact}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Repeat size={14} className="text-indigo-500" />
                {t.modal.repeat}
              </label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as TaskRepeat)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="none">{t.modal.repeatNone}</option>
                <option value="daily">{t.modal.repeatDaily}</option>
                <option value="weekly">{t.modal.repeatWeekly}</option>
                <option value="monthly">{t.modal.repeatMonthly}</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {t.tasks.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition transform active:scale-95"
            >
              {initialTask ? t.modal.updateTask : t.modal.saveTask}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
