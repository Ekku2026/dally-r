import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  ArrowRight,
  Plus,
  AlertTriangle,
  Sparkles,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  TrendingUp,
  Smartphone,
  Download,
} from 'lucide-react';
import { Task, RoutineItem, Category, UserProfile, StreakData, ActiveTab } from '../types';
import { translations } from '../utils/translations';
import { getTodayDateString } from '../utils/storage';

interface DashboardPageProps {
  tasks: Task[];
  routines: RoutineItem[];
  categories: Category[];
  profile: UserProfile;
  streak: StreakData;
  language: 'hi' | 'en';
  onToggleTask: (taskId: string) => void;
  onToggleRoutine: (routineId: string) => void;
  onOpenTaskModal: (task?: Task) => void;
  onRescheduleOverdue: () => void;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenInstallModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  tasks,
  routines,
  categories,
  profile,
  streak,
  language,
  onToggleTask,
  onToggleRoutine,
  onOpenTaskModal,
  onRescheduleOverdue,
  onChangeTab,
  onOpenInstallModal,
}) => {
  const t = translations[language];
  const todayStr = getTodayDateString();

  // Greeting determination
  const hour = new Date().getHours();
  let greeting = t.greetings.morning;
  if (hour >= 12 && hour < 17) greeting = t.greetings.afternoon;
  else if (hour >= 17 && hour < 21) greeting = t.greetings.evening;
  else if (hour >= 21 || hour < 5) greeting = t.greetings.night;

  // Formatted date string
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const formattedDate = new Date().toLocaleDateString(
    language === 'hi' ? 'hi-IN' : 'en-US',
    dateOptions
  );

  // Filter tasks for today
  const todaysTasks = tasks.filter((task) => task.date === todayStr);
  const completedTasks = todaysTasks.filter((t) => t.isCompleted);
  const pendingTasks = todaysTasks.filter((t) => !t.isCompleted);
  const totalCount = todaysTasks.length;
  const completedCount = completedTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Overdue tasks (before today and not completed)
  const overdueTasks = tasks.filter((t) => t.date < todayStr && !t.isCompleted);

  // Routine completion
  const completedRoutines = routines.filter((r) => r.isCompleted).length;
  const routineProgress = routines.length > 0 ? Math.round((completedRoutines / routines.length) * 100) : 0;

  // Upcoming tasks for today (sorted by startTime)
  const upcomingTasks = pendingTasks
    .filter((task) => !!task.startTime)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
    .slice(0, 3);

  // Daily motivation quote
  const quoteIndex = new Date().getDate() % t.dashboard.motivationQuotes.length;
  const motivationQuote = t.dashboard.motivationQuotes[quoteIndex];

  const getCategory = (catId: string) =>
    categories.find((c) => c.id === catId) || categories[categories.length - 1];

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Hero Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-amber-500 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium mb-2">
              <CalendarDays size={14} />
              <span>{formattedDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, {profile.name.split(' ')[0] || t.greetings.defaultUser} 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-100/90 max-w-xl italic flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-300 shrink-0" />
              "{motivationQuote}"
            </p>
          </div>

          {/* Quick Streak Badge */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:px-4 flex items-center gap-3 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-md">
              <span className="animate-flame">🔥</span>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-200">
                {t.dashboard.streak}
              </div>
              <div className="text-lg font-black leading-none">
                {streak.currentStreak} {language === 'hi' ? 'दिन' : 'Days'}
              </div>
            </div>
          </div>
        </div>

        {/* Overdue alert banner if any */}
        {overdueTasks.length > 0 && (
          <div className="mt-5 p-3 rounded-2xl bg-rose-500/30 border border-rose-300/40 backdrop-blur-md flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle size={16} className="text-amber-300" />
              <span>{t.dashboard.overdueWarning(overdueTasks.length)}</span>
            </div>
            <button
              onClick={onRescheduleOverdue}
              className="px-3 py-1 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-xl transition shadow-sm"
            >
              {t.dashboard.rescheduleToToday}
            </button>
          </div>
        )}
      </div>

      {/* APK / App Install Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/5 border border-amber-300/60 dark:border-amber-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>{language === 'hi' ? '📲 इस ऐप को मोबाइल में इंस्टॉल करें (APK)' : '📲 Install Mobile App (APK)'}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase">Offline</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'Chrome में बिना डाउनलोड इंतज़ार सीधे फोन पर इंस्टॉल करें या .APK फ़ाइल बनाएं'
                : 'Directly install as a native phone app or get standalone .APK'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenInstallModal}
          className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-95 shrink-0 flex items-center gap-1.5"
        >
          <Download size={14} className="stroke-[2.5]" />
          <span>{language === 'hi' ? 'APK / ऐप प्राप्त करें' : 'Get APK / App'}</span>
        </button>
      </div>

      {/* 2. Today's Progress Card & Stats Counter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Progress Bar Card */}
        <div className="md:col-span-2 rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600 dark:text-indigo-400" />
                {t.dashboard.todayProgress}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.dashboard.completedCount(completedCount, totalCount)}
              </p>
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-amber-500 bg-clip-text text-transparent">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 mt-1.5">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Mini Stat Pills */}
          <div className="grid grid-cols-3 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {t.dashboard.totalTasks}
              </span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{totalCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-center">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {t.dashboard.completed}
              </span>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{completedCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-center">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                {t.dashboard.pending}
              </span>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        {/* Quick Routine Snippet & Action Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Clock size={16} className="text-amber-500" />
                {t.dashboard.todaysRoutine}
              </h3>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {completedRoutines}/{routines.length}
              </span>
            </div>

            {/* Routine Progress bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${routineProgress}%` }}
              />
            </div>

            {/* Quick 3 routine slots */}
            <div className="space-y-2">
              {routines.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleRoutine(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    item.isCompleted
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{item.icon}</span>
                    <span className="font-semibold truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onChangeTab('routine')}
            className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition flex items-center justify-center gap-1"
          >
            <span>{t.dashboard.viewAllRoutine}</span>
          </button>
        </div>
      </div>

      {/* 3. Today's Tasks Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-indigo-600 rounded-full" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {language === 'hi' ? 'आज के कार्य (Today\'s Tasks)' : "Today's Tasks"}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {todaysTasks.length}
            </span>
          </div>
          <button
            onClick={() => onOpenTaskModal()}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Plus size={16} />
            <span>{t.dashboard.quickAddTask}</span>
          </button>
        </div>

        {/* Task List or Empty state */}
        {todaysTasks.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <CheckCheck size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">{t.tasks.emptyTitle}</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{t.tasks.emptySub}</p>
            <button
              onClick={() => onOpenTaskModal()}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition"
            >
              {t.tasks.createFirstTask}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todaysTasks.map((task) => {
              const cat = getCategory(task.categoryId);
              return (
                <div
                  key={task.id}
                  className={`group flex items-start sm:items-center justify-between p-3.5 rounded-2xl border transition ${
                    task.isCompleted
                      ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800/80 text-slate-400'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 sm:mt-0 transition transform active:scale-90 shrink-0"
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle size={22} className="text-slate-400 hover:text-indigo-600" />
                      )}
                    </button>

                    {/* Title and details */}
                    <div className="flex-1 min-w-0" onClick={() => onOpenTaskModal(task)}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-sm ${
                            task.isCompleted
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Priority tag */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            task.priority === 'high'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : task.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {task.priority === 'high'
                            ? t.modal.priorityHigh
                            : task.priority === 'medium'
                            ? t.modal.priorityMedium
                            : t.modal.priorityLow}
                        </span>

                        {/* Category */}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <span>{cat.icon}</span>
                          <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Time and Edit Chevron */}
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {task.startTime && (
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 px-2 py-1 rounded-lg">
                        <Clock size={12} className="text-indigo-500" />
                        {task.startTime}
                        {task.endTime ? ` - ${task.endTime}` : ''}
                      </span>
                    )}
                    <button
                      onClick={() => onOpenTaskModal(task)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={() => onChangeTab('tasks')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>{t.dashboard.viewAllTasks}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 4. Upcoming Tasks Preview */}
      {upcomingTasks.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              {t.dashboard.upcomingTasks}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onOpenTaskModal(task)}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:border-amber-400 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                  <Clock size={13} />
                  <span>{task.startTime}</span>
                </div>
                <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate">
                  {task.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
