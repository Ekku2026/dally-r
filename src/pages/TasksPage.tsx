import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertTriangle,
  Trash2,
  Edit,
  ArrowUpDown,
  Tag,
  Repeat,
  Bell,
  CheckCheck,
} from 'lucide-react';
import { Task, Category, Priority } from '../types';
import { translations } from '../utils/translations';
import { getTodayDateString } from '../utils/storage';

interface TasksPageProps {
  tasks: Task[];
  categories: Category[];
  language: 'hi' | 'en';
  onToggleTask: (taskId: string) => void;
  onOpenTaskModal: (task?: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onRescheduleTask: (taskId: string, newDate: string) => void;
}

type FilterOption = 'all' | 'pending' | 'completed' | 'high' | 'today' | 'tomorrow' | 'this_week' | 'overdue';
type SortOption = 'time' | 'priority' | 'name';

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  categories,
  language,
  onToggleTask,
  onOpenTaskModal,
  onDeleteTask,
  onRescheduleTask,
}) => {
  const t = translations[language];
  const todayStr = getTodayDateString();
  const tomorrowStr = getTodayDateString(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Date threshold for this week (today to +6 days)
  const nextWeekStr = getTodayDateString(7);

  // Filter and Sort logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) {
          return false;
        }

        // Filter tab
        switch (activeFilter) {
          case 'pending':
            return !task.isCompleted;
          case 'completed':
            return task.isCompleted;
          case 'high':
            return task.priority === 'high';
          case 'today':
            return task.date === todayStr;
          case 'tomorrow':
            return task.date === tomorrowStr;
          case 'this_week':
            return task.date >= todayStr && task.date <= nextWeekStr;
          case 'overdue':
            return task.date < todayStr && !task.isCompleted;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        if (sortBy === 'time') {
          // Sort by date then startTime
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return (a.startTime || '99:99').localeCompare(b.startTime || '99:99');
        }
        if (sortBy === 'priority') {
          const priorityScore = (p: Priority) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
          return priorityScore(b.priority) - priorityScore(a.priority);
        }
        if (sortBy === 'name') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, searchQuery, activeFilter, selectedCategory, sortBy, todayStr, tomorrowStr, nextWeekStr]);

  const getCategory = (catId: string) =>
    categories.find((c) => c.id === catId) || categories[categories.length - 1];

  const filterTabs: Array<{ id: FilterOption; label: string }> = [
    { id: 'all', label: t.tasks.all },
    { id: 'pending', label: t.tasks.pending },
    { id: 'completed', label: t.tasks.completed },
    { id: 'high', label: t.tasks.highPriority },
    { id: 'today', label: t.tasks.today },
    { id: 'tomorrow', label: t.tasks.tomorrow },
    { id: 'this_week', label: t.tasks.thisWeek },
    { id: 'overdue', label: t.tasks.overdue },
  ];

  return (
    <div className="space-y-5 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {t.tasks.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'अपने सभी कार्यों को व्यवस्थित करें और ट्रैक करें' : 'Organize, schedule and accomplish your goals'}
          </p>
        </div>
        <button
          onClick={() => onOpenTaskModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>{t.nav.addTask}</span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.tasks.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
            <ArrowUpDown size={14} />
            {t.tasks.sortBy}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="time">{t.tasks.timeEarliest}</option>
            <option value="priority">{t.tasks.priorityHigh}</option>
            <option value="name">{t.tasks.nameAZ}</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs (Horizontal scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
            selectedCategory === 'all'
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 ring-2 ring-indigo-500'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <CheckCheck size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">{t.tasks.emptyTitle}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{t.tasks.emptySub}</p>
          <button
            onClick={() => onOpenTaskModal()}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition"
          >
            {t.tasks.createFirstTask}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const cat = getCategory(task.categoryId);
            const isOverdue = task.date < todayStr && !task.isCompleted;

            return (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-3xl border transition gap-3 ${
                  task.isCompleted
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-80'
                    : isOverdue
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 shadow-sm'
                }`}
              >
                {/* Left check & details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 transition transform active:scale-90 shrink-0"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 size={24} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle size={24} className="text-slate-400 hover:text-indigo-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        onClick={() => onOpenTaskModal(task)}
                        className={`text-sm font-bold cursor-pointer hover:text-indigo-600 ${
                          task.isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h3>

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

                      {/* Category tag */}
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                        <span>{cat.icon}</span>
                        <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
                      </span>

                      {/* Repeat badge if any */}
                      {task.repeat !== 'none' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          <Repeat size={10} />
                          <span>{task.repeat}</span>
                        </span>
                      )}

                      {/* Reminder badge if any */}
                      {task.reminder !== 'none' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                          <Bell size={10} />
                          <span>{task.reminder}</span>
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Date and time badges */}
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className={`flex items-center gap-1 ${isOverdue ? 'text-rose-600 font-bold' : ''}`}>
                        <Calendar size={13} className={isOverdue ? 'text-rose-500' : 'text-slate-400'} />
                        {task.date === todayStr
                          ? t.tasks.today
                          : task.date === tomorrowStr
                          ? t.tasks.tomorrow
                          : task.date}
                        {isOverdue && ' (Overdue)'}
                      </span>

                      {task.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" />
                          {task.startTime}
                          {task.endTime ? ` - ${task.endTime}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  {/* Reschedule Button */}
                  <button
                    onClick={() => onRescheduleTask(task.id, todayStr)}
                    title={t.tasks.reschedule}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Calendar size={16} />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => onOpenTaskModal(task)}
                    title={t.tasks.edit}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Edit size={16} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setTaskToDelete(task.id)}
                    title={t.tasks.delete}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="text-center font-bold text-base text-slate-800 dark:text-slate-100">
              {t.tasks.deleteConfirm}
            </h3>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.tasks.deleteConfirmSub}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setTaskToDelete(null)}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {t.tasks.cancel}
              </button>
              <button
                onClick={() => {
                  if (taskToDelete) {
                    onDeleteTask(taskToDelete);
                    setTaskToDelete(null);
                  }
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition active:scale-95"
              >
                {t.tasks.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
