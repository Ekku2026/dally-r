import React, { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Briefcase,
  Dumbbell,
  Check,
} from 'lucide-react';
import { RoutineItem, Category } from '../types';
import { translations } from '../utils/translations';
import { DEFAULT_ROUTINES } from '../utils/storage';

interface RoutinePageProps {
  routines: RoutineItem[];
  categories: Category[];
  language: 'hi' | 'en';
  onToggleRoutine: (routineId: string) => void;
  onOpenRoutineModal: (item?: RoutineItem) => void;
  onDeleteRoutine: (routineId: string) => void;
  onReorderRoutine: (routines: RoutineItem[]) => void;
  onResetTodayRoutine: () => void;
}

export const RoutinePage: React.FC<RoutinePageProps> = ({
  routines,
  categories,
  language,
  onToggleRoutine,
  onOpenRoutineModal,
  onDeleteRoutine,
  onReorderRoutine,
  onResetTodayRoutine,
}) => {
  const t = translations[language];

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const completedCount = routines.filter((r) => r.isCompleted).length;
  const progressPercent = routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0;

  const getCategory = (catId: string) =>
    categories.find((c) => c.id === catId) || categories[categories.length - 1];

  // Presets
  const applyPreset = (type: 'student' | 'work' | 'fitness') => {
    let presetItems: RoutineItem[] = [];

    if (type === 'student') {
      presetItems = [
        { id: `r_${Date.now()}_1`, time: '05:30 AM', title: 'Wake Up & Revision', icon: '🌅', categoryId: 'cat_study', isCompleted: false, order: 1 },
        { id: `r_${Date.now()}_2`, time: '06:30 AM', title: 'Morning Exercise & Walk', icon: '🏃', categoryId: 'cat_health', isCompleted: false, order: 2 },
        { id: `r_${Date.now()}_3`, time: '08:00 AM', title: 'School / College Classes', icon: '📚', categoryId: 'cat_study', isCompleted: false, order: 3 },
        { id: `r_${Date.now()}_4`, time: '01:30 PM', title: 'Lunch & Power Nap', icon: '🥗', categoryId: 'cat_personal', isCompleted: false, order: 4 },
        { id: `r_${Date.now()}_5`, time: '04:00 PM', title: 'Homework & Assignment', icon: '✏️', categoryId: 'cat_study', isCompleted: false, order: 5 },
        { id: `r_${Date.now()}_6`, time: '07:00 PM', title: 'Mock Test & Problem Solving', icon: '🎯', categoryId: 'cat_study', isCompleted: false, order: 6 },
        { id: `r_${Date.now()}_7`, time: '08:30 PM', title: 'Dinner & Family Time', icon: '🍽️', categoryId: 'cat_personal', isCompleted: false, order: 7 },
        { id: `r_${Date.now()}_8`, time: '10:30 PM', title: 'Bedtime & Sleep', icon: '😴', categoryId: 'cat_health', isCompleted: false, order: 8 },
      ];
    } else if (type === 'work') {
      presetItems = DEFAULT_ROUTINES.map((item, idx) => ({
        ...item,
        id: `r_work_${Date.now()}_${idx}`,
        isCompleted: false,
      }));
    } else if (type === 'fitness') {
      presetItems = [
        { id: `r_${Date.now()}_1`, time: '05:00 AM', title: 'Wake Up & Hydrate (1L Water)', icon: '💧', categoryId: 'cat_health', isCompleted: false, order: 1 },
        { id: `r_${Date.now()}_2`, time: '05:30 AM', title: 'Pre-Workout Snack', icon: '🍌', categoryId: 'cat_health', isCompleted: false, order: 2 },
        { id: `r_${Date.now()}_3`, time: '06:00 AM', title: 'Gym / Strength & Cardio', icon: '🏋️', categoryId: 'cat_health', isCompleted: false, order: 3 },
        { id: `r_${Date.now()}_4`, time: '07:30 AM', title: 'Post-Workout High Protein Shake', icon: '🥛', categoryId: 'cat_health', isCompleted: false, order: 4 },
        { id: `r_${Date.now()}_5`, time: '09:00 AM', title: 'Work Session 1', icon: '💻', categoryId: 'cat_work', isCompleted: false, order: 5 },
        { id: `r_${Date.now()}_6`, time: '01:00 PM', title: 'Clean Wholefood Lunch', icon: '🥗', categoryId: 'cat_health', isCompleted: false, order: 6 },
        { id: `r_${Date.now()}_7`, time: '06:00 PM', title: '10,000 Steps Evening Walk', icon: '🚶', categoryId: 'cat_health', isCompleted: false, order: 7 },
        { id: `r_${Date.now()}_8`, time: '08:00 PM', title: 'Light Dinner', icon: '🍲', categoryId: 'cat_health', isCompleted: false, order: 8 },
        { id: `r_${Date.now()}_9`, time: '10:00 PM', title: '8 Hours Deep Sleep', icon: '😴', categoryId: 'cat_health', isCompleted: false, order: 9 },
      ];
    }

    onReorderRoutine(presetItems);
    setShowPresets(false);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...routines];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    // re-assign order
    const updated = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    onReorderRoutine(updated);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl shadow-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
              <Clock size={14} />
              <span>{t.routine.morningToNight}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.routine.title}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-lg">
              {t.routine.subtitle}
            </p>
          </div>

          {/* Routine Progress Circle / Badge */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-200">
                {t.routine.progress}
              </div>
              <div className="text-xl font-black">
                {completedCount} / {routines.length}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white text-amber-600 font-black text-sm flex items-center justify-center shadow-md">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress Bar inside banner */}
        <div className="mt-6">
          <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden p-0.5 backdrop-blur-sm">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Add Routine Slot Button */}
          <button
            onClick={() => onOpenRoutineModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition active:scale-95"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>{t.routine.addRoutineItem}</span>
          </button>

          {/* Presets dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>{t.routine.loadPreset}</span>
            </button>

            {showPresets && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-20 space-y-1">
                <button
                  onClick={() => applyPreset('student')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center gap-2 transition"
                >
                  <BookOpen size={14} className="text-blue-500" />
                  <span>{t.routine.studentPreset}</span>
                </button>
                <button
                  onClick={() => applyPreset('work')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center gap-2 transition"
                >
                  <Briefcase size={14} className="text-indigo-500" />
                  <span>{t.routine.workPreset}</span>
                </button>
                <button
                  onClick={() => applyPreset('fitness')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center gap-2 transition"
                >
                  <Dumbbell size={14} className="text-rose-500" />
                  <span>{t.routine.fitnessPreset}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reset Status Button */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition"
        >
          <RotateCcw size={14} />
          <span>{t.routine.resetToday}</span>
        </button>
      </div>

      {/* Routine Timeline */}
      {routines.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <Clock size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">{t.routine.emptyRoutine}</h3>
          <button
            onClick={() => onOpenRoutineModal()}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition"
          >
            {t.routine.addRoutineItem}
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 space-y-3">
          {routines.map((item, index) => {
            const cat = getCategory(item.categoryId);
            return (
              <div
                key={item.id}
                className={`relative flex items-center justify-between p-4 rounded-3xl border transition ${
                  item.isCompleted
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 shadow-sm'
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition ${
                    item.isCompleted
                      ? 'bg-emerald-500 border-white dark:border-slate-900'
                      : 'bg-amber-500 border-white dark:border-slate-900 ring-2 ring-amber-500/30'
                  }`}
                />

                {/* Left check & details */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleRoutine(item.id)}
                    className="transition transform active:scale-90 shrink-0"
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 size={24} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle size={24} className="text-slate-400 hover:text-amber-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <span
                        className={`text-sm font-bold truncate ${
                          item.isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {language === 'hi' ? cat.nameHi : cat.nameEn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Time Badge & Actions */}
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
                    {item.time}
                  </span>

                  {/* Reorder Buttons */}
                  <div className="hidden sm:flex items-center">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === routines.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Edit */}
                  <button
                    onClick={() => onOpenRoutineModal(item)}
                    className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit size={15} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteRoutine(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <RotateCcw size={22} />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {t.routine.resetConfirm}
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.tasks.cancel}
              </button>
              <button
                onClick={() => {
                  onResetTodayRoutine();
                  setShowResetConfirm(false);
                }}
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25"
              >
                {t.routine.resetToday}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
