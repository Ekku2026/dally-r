import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { Task, Category } from '../types';
import { translations } from '../utils/translations';
import { getTodayDateString } from '../utils/storage';

interface CalendarPageProps {
  tasks: Task[];
  categories: Category[];
  language: 'hi' | 'en';
  onToggleTask: (taskId: string) => void;
  onOpenTaskModal: (task?: Task, defaultDate?: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  tasks,
  categories,
  language,
  onToggleTask,
  onOpenTaskModal,
}) => {
  const t = translations[language];
  const todayStr = getTodayDateString();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const monthName = language === 'hi' ? monthNamesHi[month] : monthNamesEn[month];

  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const weekDays = language === 'hi' ? weekDaysHi : weekDaysEn;

  // Month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(todayStr);
  };

  // Group tasks by date
  const tasksByDate = React.useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    }
    return map;
  }, [tasks]);

  const selectedTasks = tasksByDate[selectedDate] || [];
  const selectedCompleted = selectedTasks.filter((t) => t.isCompleted).length;

  const getCategory = (catId: string) =>
    categories.find((c) => c.id === catId) || categories[categories.length - 1];

  // Build grid calendar days
  const calendarCells = [];
  // Previous month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateStr: '',
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
    });
  }

  // Next month padding to fill row of 7
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining && calendarCells.length % 7 !== 0; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateStr: '',
    });
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {monthName} {year}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi' ? 'किसी भी तारीख पर क्लिक करके उस दिन के टास्क देखें' : 'Click any date to inspect tasks & routines'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={goToday}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition"
          >
            {t.calendar.today}
          </button>
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 sm:p-6">
        {/* Week Day Labels */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {weekDays.map((wd, i) => (
            <div
              key={wd}
              className={`text-xs font-extrabold py-2 ${
                i === 0 || i === 6 ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarCells.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div
                  key={`empty_${idx}`}
                  className="min-h-[55px] sm:min-h-[75px] rounded-2xl p-1.5 text-slate-300 dark:text-slate-700 text-xs font-semibold flex items-start justify-end"
                >
                  {cell.day}
                </div>
              );
            }

            const dayTasks = tasksByDate[cell.dateStr] || [];
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDate;
            const completedInDay = dayTasks.filter((t) => t.isCompleted).length;
            const hasTasks = dayTasks.length > 0;
            const allCompleted = hasTasks && completedInDay === dayTasks.length;

            return (
              <div
                key={cell.dateStr}
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`min-h-[55px] sm:min-h-[75px] rounded-2xl p-2 cursor-pointer transition flex flex-col justify-between border ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-md'
                    : isToday
                    ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'
                }`}
              >
                {/* Date number */}
                <div className="flex items-center justify-between">
                  {isToday ? (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-black flex items-center justify-center shadow-sm">
                      {cell.day}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cell.day}
                    </span>
                  )}

                  {/* Task count badge */}
                  {hasTasks && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        allCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                      }`}
                    >
                      {completedInDay}/{dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Dots indicator for tasks */}
                {hasTasks && (
                  <div className="flex items-center gap-1 mt-1 overflow-hidden">
                    {dayTasks.slice(0, 3).map((t) => (
                      <span
                        key={t.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.isCompleted
                            ? 'bg-emerald-500'
                            : t.priority === 'high'
                            ? 'bg-rose-500'
                            : 'bg-indigo-500'
                        }`}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-bold">+{dayTasks.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Tasks Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {t.calendar.tasksOn(selectedDate === todayStr ? `${selectedDate} (${t.calendar.today})` : selectedDate)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedTasks.length > 0
                ? `${selectedCompleted} of ${selectedTasks.length} tasks completed`
                : t.calendar.noTasksForDay}
            </p>
          </div>

          <button
            onClick={() => onOpenTaskModal(undefined, selectedDate)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition active:scale-95 self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>{t.calendar.addTaskForDay}</span>
          </button>
        </div>

        {selectedTasks.length === 0 ? (
          <div className="py-10 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <CheckCheck size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs text-slate-400">{t.calendar.noTasksForDay}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedTasks.map((task) => {
              const cat = getCategory(task.categoryId);
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                    task.isCompleted
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="transition transform active:scale-90 shrink-0"
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle size={22} className="text-slate-400 hover:text-indigo-600" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold ${
                            task.isCompleted
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <span>{cat.icon}</span>
                          <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {task.startTime && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 ml-2">
                      <Clock size={12} className="text-indigo-500" />
                      {task.startTime}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
