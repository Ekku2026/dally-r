import React from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Zap,
} from 'lucide-react';
import { Task, StreakData } from '../types';
import { translations } from '../utils/translations';
import { getTodayDateString } from '../utils/storage';

interface AnalyticsPageProps {
  tasks: Task[];
  streak: StreakData;
  language: 'hi' | 'en';
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  tasks,
  streak,
  language,
}) => {
  const t = translations[language];
  const todayStr = getTodayDateString();

  // Metrics
  const todaysTasks = tasks.filter((t) => t.date === todayStr);
  const todayCompleted = todaysTasks.filter((t) => t.isCompleted).length;
  const todayRate = todaysTasks.length > 0 ? Math.round((todayCompleted / todaysTasks.length) * 100) : 0;

  // Last 7 days metrics
  const last7Days: Array<{ date: string; label: string; total: number; completed: number; rate: number }> = [];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  const weekdayStats: Record<number, { completed: number; total: number }> = {
    0: { completed: 0, total: 0 },
    1: { completed: 0, total: 0 },
    2: { completed: 0, total: 0 },
    3: { completed: 0, total: 0 },
    4: { completed: 0, total: 0 },
    5: { completed: 0, total: 0 },
    6: { completed: 0, total: 0 },
  };

  for (let i = 6; i >= 0; i--) {
    const dStr = getTodayDateString(-i);
    const dObj = new Date(dStr);
    const dayOfWeek = dObj.getDay();
    const dayTasks = tasks.filter((t) => t.date === dStr);
    const dayCompleted = dayTasks.filter((t) => t.isCompleted).length;
    const rate = dayTasks.length > 0 ? Math.round((dayCompleted / dayTasks.length) * 100) : 0;

    last7Days.push({
      date: dStr,
      label: language === 'hi' ? dayNamesHi[dayOfWeek] : dayNamesEn[dayOfWeek],
      total: dayTasks.length,
      completed: dayCompleted,
      rate,
    });
  }

  // Calculate weekday performance across all tasks to find most productive day
  tasks.forEach((t) => {
    const dObj = new Date(t.date);
    const day = dObj.getDay();
    if (!isNaN(day)) {
      weekdayStats[day].total += 1;
      if (t.isCompleted) weekdayStats[day].completed += 1;
    }
  });

  let bestDayIndex = 3; // Wednesday default
  let bestDayScore = -1;
  Object.entries(weekdayStats).forEach(([day, stat]) => {
    const dayNum = Number(day);
    const score = stat.completed;
    if (score > bestDayScore) {
      bestDayScore = score;
      bestDayIndex = dayNum;
    }
  });

  const bestDayName = language === 'hi' ? dayNamesHi[bestDayIndex] : dayNamesEn[bestDayIndex];

  // Weekly completion rate
  const weekTotal = last7Days.reduce((acc, curr) => acc + curr.total, 0);
  const weekCompleted = last7Days.reduce((acc, curr) => acc + curr.completed, 0);
  const weekRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 75;

  // Monthly stats
  const currentMonthPrefix = todayStr.substring(0, 7);
  const monthTasks = tasks.filter((t) => t.date.startsWith(currentMonthPrefix));
  const monthCompleted = monthTasks.filter((t) => t.isCompleted).length;
  const monthRate = monthTasks.length > 0 ? Math.round((monthCompleted / monthTasks.length) * 100) : 80;

  // Lifetime counts
  const totalCompleted = tasks.filter((t) => t.isCompleted).length;
  const totalPending = tasks.filter((t) => !t.isCompleted).length;

  // Overall productivity score (0 - 100)
  const productivityScore = Math.min(
    100,
    Math.round((todayRate * 0.4 + weekRate * 0.4 + Math.min(streak.currentStreak * 5, 20)))
  );

  // Milestones for streak
  const streakMilestones = [
    { days: 1, title: language === 'hi' ? '1 दिन स्ट्राइक' : '1 Day Streak', icon: '🔥', desc: language === 'hi' ? 'शुरुआत' : 'Kickoff' },
    { days: 7, title: language === 'hi' ? '7 दिन स्ट्राइक' : '7 Day Streak', icon: '⚡', desc: language === 'hi' ? 'सप्ताह योद्धा' : 'Week Warrior' },
    { days: 14, title: language === 'hi' ? '14 दिन स्ट्राइक' : '14 Day Streak', icon: '🛡️', desc: language === 'hi' ? 'निरंतरता' : 'Unstoppable' },
    { days: 30, title: language === 'hi' ? '30 दिन स्ट्राइक' : '30 Day Streak', icon: '👑', desc: language === 'hi' ? 'मास्टर' : 'Monthly Master' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2">
              <BarChart3 size={14} />
              <span>{t.analytics.subtitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.analytics.title}
            </h1>
          </div>

          {/* Productivity score badge */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200">
                {t.analytics.productivityScore}
              </div>
              <div className="text-xl font-black">{productivityScore} / 100</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 font-black text-xl flex items-center justify-center shadow-md">
              <Zap size={22} className="fill-slate-900" />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.analytics.todayCompletion}
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Clock size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{todayRate}%</div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                style={{ width: `${todayRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weekly */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.analytics.weekCompletion}
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{weekRate}%</div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${weekRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Monthly */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t.analytics.monthCompletion}
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Calendar size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{monthRate}%</div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${monthRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Chart & Most Productive Day Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visual Bar Chart */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" />
              {t.analytics.chartTitle}
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {weekCompleted} {language === 'hi' ? 'कार्य पूर्ण' : 'tasks done'}
            </span>
          </div>

          {/* Bar Columns */}
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-slate-100 dark:border-slate-800">
            {last7Days.map((item, idx) => {
              const isToday = item.date === todayStr;
              const heightPercent = Math.max(12, item.rate);
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 mb-1 transition">
                    {item.completed}
                  </span>
                  {/* Bar */}
                  <div className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex flex-col justify-end p-0.5">
                    <div
                      className={`w-full rounded-xl transition-all duration-700 ${
                        isToday
                          ? 'bg-gradient-to-t from-amber-500 to-amber-400 shadow-sm shadow-amber-500/20'
                          : 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  {/* Label */}
                  <span
                    className={`text-xs mt-2 font-bold ${
                      isToday ? 'text-amber-500 font-black' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Productive Day & Lifetime stats */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-100">
                {t.analytics.mostProductiveDay}
              </span>
              <div className="text-3xl font-black mt-1 flex items-center gap-2">
                <span>🏆</span>
                <span>{bestDayName}</span>
              </div>
            </div>
            <p className="text-xs text-amber-100/90 mt-4">
              {language === 'hi'
                ? 'इस दिन आप सबसे ज्यादा कार्य कुशलतापूर्वक पूरे करते हैं।'
                : 'You consistently complete the most tasks on this day.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400">
                {t.analytics.totalCompleted}
              </span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalCompleted}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400">
                {t.analytics.totalPending}
              </span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {totalPending}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak System Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Flame size={20} className="text-amber-500" />
              {t.analytics.streakTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.analytics.streakBreakdown}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 text-xs font-bold">
              {t.analytics.currentStreak}: {streak.currentStreak} {language === 'hi' ? 'दिन' : 'days'}
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 text-xs font-bold">
              {t.analytics.longestStreak}: {streak.longestStreak} {language === 'hi' ? 'दिन' : 'days'}
            </div>
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {streakMilestones.map((m) => {
            const isUnlocked = streak.currentStreak >= m.days || streak.longestStreak >= m.days;
            return (
              <div
                key={m.days}
                className={`p-4 rounded-2xl border text-center transition ${
                  isUnlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="text-3xl mb-1">{m.icon}</div>
                <div className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{m.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                <div className="mt-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {isUnlocked ? (language === 'hi' ? 'प्राप्त ✔' : 'Unlocked ✔') : (language === 'hi' ? 'प्रगति जारी' : 'In Progress')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational advice card */}
        <div className="mt-5 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center gap-3">
          <Sparkles size={20} className="text-amber-500 shrink-0" />
          <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            {streak.currentStreak > 0 ? t.analytics.streakKeepGoing : t.analytics.streakBrokenMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
