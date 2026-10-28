import React, { useState, useEffect } from 'react';
import {
  Task,
  RoutineItem,
  Category,
  UserProfile,
  UserSettings,
  StreakData,
  ActiveTab,
} from './types';
import {
  loadTasks,
  saveTasks,
  loadRoutine,
  saveRoutine,
  loadCategories,
  saveCategories,
  loadProfile,
  saveProfile,
  loadSettings,
  saveSettings,
  loadStreak,
  saveStreak,
  recordTaskCompletion,
  getTodayDateString,
  DEFAULT_CATEGORIES,
} from './utils/storage';
import { translations } from './utils/translations';
import { triggerConfetti, playChimeSound } from './utils/confetti';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { TaskModal } from './components/TaskModal';
import { RoutineModal } from './components/RoutineModal';
import { CategoryModal } from './components/CategoryModal';
import { AuthModal } from './components/AuthModal';
import { InstallModal } from './components/InstallModal';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { RoutinePage } from './pages/RoutinePage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { DownloadApkPage } from './pages/DownloadApkPage';
import {
  Home,
  CheckSquare,
  Clock,
  Calendar as CalendarIcon,
  BarChart3,
  User,
  Download,
} from 'lucide-react';

export default function App() {
  // State Initialization
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [routines, setRoutines] = useState<RoutineItem[]>(() => loadRoutine());
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [streak, setStreak] = useState<StreakData>(() => loadStreak());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskDefaultDate, setTaskDefaultDate] = useState<string | undefined>();

  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineItem | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Sync theme with HTML class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Periodic reminder checking
  useEffect(() => {
    const interval = setInterval(() => {
      if (!settings.notificationsEnabled) return;
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const today = getTodayDateString();

      // Check tasks matching current time
      const dueTasks = tasks.filter(
        (t) => !t.isCompleted && t.date === today && t.startTime === currentTimeStr
      );

      if (dueTasks.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
        dueTasks.forEach((task) => {
          new Notification('Daily Routine Reminder ⏰', {
            body: `${task.title} - ${task.startTime}`,
            icon: '/favicon.ico',
          });
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks, settings.notificationsEnabled]);

  // Task Actions
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((task) => {
      if (task.id === taskId) {
        const nextCompleted = !task.isCompleted;
        if (nextCompleted) {
          triggerConfetti();
          if (settings.soundEnabled) playChimeSound();
          const newStreak = recordTaskCompletion(streak);
          setStreak(newStreak);
        }
        return {
          ...task,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });

    setTasks(updated);
    saveTasks(updated);
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'order' | 'isCompleted'> & { id?: string }
  ) => {
    if (taskData.id) {
      // Edit existing task
      const updated = tasks.map((t) =>
        t.id === taskData.id ? { ...t, ...taskData } : t
      );
      setTasks(updated);
      saveTasks(updated);
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        isCompleted: false,
        order: tasks.length + 1,
        createdAt: new Date().toISOString(),
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      saveTasks(updated);

      if (settings.soundEnabled) playChimeSound();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
  };

  const handleRescheduleTask = (taskId: string, newDate: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, date: newDate } : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  const handleRescheduleOverdue = () => {
    const today = getTodayDateString();
    const updated = tasks.map((t) =>
      t.date < today && !t.isCompleted ? { ...t, date: today } : t
    );
    setTasks(updated);
    saveTasks(updated);
    if (settings.soundEnabled) playChimeSound();
  };

  // Routine Actions
  const handleToggleRoutine = (routineId: string) => {
    const updated = routines.map((item) => {
      if (item.id === routineId) {
        const nextCompleted = !item.isCompleted;
        if (nextCompleted) {
          triggerConfetti();
          if (settings.soundEnabled) playChimeSound();
        }
        return {
          ...item,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return item;
    });

    setRoutines(updated);
    saveRoutine(updated);
  };

  const handleSaveRoutine = (
    itemData: Omit<RoutineItem, 'id' | 'isCompleted' | 'order'> & { id?: string }
  ) => {
    if (itemData.id) {
      const updated = routines.map((r) =>
        r.id === itemData.id ? { ...r, ...itemData } : r
      );
      setRoutines(updated);
      saveRoutine(updated);
    } else {
      const newItem: RoutineItem = {
        ...itemData,
        id: `routine_${Date.now()}`,
        isCompleted: false,
        order: routines.length + 1,
      };
      const updated = [...routines, newItem];
      setRoutines(updated);
      saveRoutine(updated);
    }
  };

  const handleDeleteRoutine = (routineId: string) => {
    const updated = routines.filter((r) => r.id !== routineId);
    setRoutines(updated);
    saveRoutine(updated);
  };

  const handleReorderRoutine = (newRoutines: RoutineItem[]) => {
    setRoutines(newRoutines);
    saveRoutine(newRoutines);
  };

  const handleResetTodayRoutine = () => {
    const updated = routines.map((r) => ({ ...r, isCompleted: false }));
    setRoutines(updated);
    saveRoutine(updated);
  };

  // Category Actions
  const handleSaveCategory = (newCat: Category) => {
    const updated = [...categories, newCat];
    setCategories(updated);
    saveCategories(updated);
  };

  // Settings & Profile
  const handleUpdateSettings = (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleResetData = () => {
    setTasks([]);
    setRoutines([]);
    setCategories(DEFAULT_CATEGORIES);
    setStreak({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: getTodayDateString(),
      history: {},
    });
  };

  const handleRefreshAllData = () => {
    setTasks(loadTasks());
    setRoutines(loadRoutine());
    setCategories(loadCategories());
    setProfile(loadProfile());
    setSettings(loadSettings());
    setStreak(loadStreak());
  };

  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const t = translations[settings.language];

  const desktopNavItems = [
    { id: 'dashboard', label: t.nav.home, icon: Home },
    { id: 'tasks', label: t.nav.tasks, icon: CheckSquare, badge: pendingCount },
    { id: 'routine', label: t.nav.routine, icon: Clock },
    { id: 'calendar', label: t.nav.calendar, icon: CalendarIcon },
    { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
    { id: 'profile', label: t.nav.profile, icon: User },
    { id: 'download', label: settings.language === 'hi' ? '📲 APK डाउनलोड' : '📲 Download APK', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenTaskModal={() => {
          setEditingTask(null);
          setTaskDefaultDate(undefined);
          setIsTaskModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        streakDays={streak.currentStreak}
      />

      {/* Desktop Sub Navigation Pills */}
      <div className="hidden sm:block bg-white/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1.5 py-2 overflow-x-auto">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={16} className={isCurrent ? 'stroke-[2.5]' : ''} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-white text-indigo-700'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-5 sm:pt-7">
        {activeTab === 'dashboard' && (
          <DashboardPage
            tasks={tasks}
            routines={routines}
            categories={categories}
            profile={profile}
            streak={streak}
            language={settings.language}
            onToggleTask={handleToggleTask}
            onToggleRoutine={handleToggleRoutine}
            onOpenTaskModal={(task) => {
              setEditingTask(task || null);
              setTaskDefaultDate(undefined);
              setIsTaskModalOpen(true);
            }}
            onRescheduleOverdue={handleRescheduleOverdue}
            onChangeTab={setActiveTab}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksPage
            tasks={tasks}
            categories={categories}
            language={settings.language}
            onToggleTask={handleToggleTask}
            onOpenTaskModal={(task) => {
              setEditingTask(task || null);
              setTaskDefaultDate(undefined);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onRescheduleTask={handleRescheduleTask}
          />
        )}

        {activeTab === 'routine' && (
          <RoutinePage
            routines={routines}
            categories={categories}
            language={settings.language}
            onToggleRoutine={handleToggleRoutine}
            onOpenRoutineModal={(item) => {
              setEditingRoutine(item || null);
              setIsRoutineModalOpen(true);
            }}
            onDeleteRoutine={handleDeleteRoutine}
            onReorderRoutine={handleReorderRoutine}
            onResetTodayRoutine={handleResetTodayRoutine}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarPage
            tasks={tasks}
            categories={categories}
            language={settings.language}
            onToggleTask={handleToggleTask}
            onOpenTaskModal={(task, date) => {
              setEditingTask(task || null);
              setTaskDefaultDate(date);
              setIsTaskModalOpen(true);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            tasks={tasks}
            streak={streak}
            language={settings.language}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsPage
            profile={profile}
            settings={settings}
            language={settings.language}
            onUpdateSettings={handleUpdateSettings}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onResetData={handleResetData}
            onRefreshAllData={handleRefreshAllData}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {activeTab === 'download' && (
          <DownloadApkPage
            language={settings.language}
            onBackToApp={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden">
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenTaskModal={() => {
            setEditingTask(null);
            setTaskDefaultDate(undefined);
            setIsTaskModalOpen(true);
          }}
          language={settings.language}
          pendingTasksCount={pendingCount}
        />
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setTaskDefaultDate(undefined);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        categories={categories}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        language={settings.language}
        defaultDate={taskDefaultDate}
      />

      <RoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => {
          setIsRoutineModalOpen(false);
          setEditingRoutine(null);
        }}
        onSave={handleSaveRoutine}
        initialItem={editingRoutine}
        categories={categories}
        language={settings.language}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        language={settings.language}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
        language={settings.language}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        language={settings.language}
      />
    </div>
  );
}
