import { Task, RoutineItem, Category, UserProfile, UserSettings, StreakData } from '../types';

const STORAGE_KEYS = {
  TASKS: 'dr_tasks_v1',
  ROUTINE: 'dr_routine_v1',
  CATEGORIES: 'dr_categories_v1',
  PROFILE: 'dr_profile_v1',
  SETTINGS: 'dr_settings_v1',
  STREAK: 'dr_streak_v1',
  USERS: 'dr_users_registry_v1',
};

// Formats date to YYYY-MM-DD
export function getTodayDateString(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_study', nameEn: 'Study', nameHi: 'पढ़ाई', icon: '📚', color: '#3b82f6' },
  { id: 'cat_work', nameEn: 'Work', nameHi: 'कार्य', icon: '💼', color: '#6366f1' },
  { id: 'cat_personal', nameEn: 'Personal', nameHi: 'व्यक्तिगत', icon: '🏠', color: '#10b981' },
  { id: 'cat_business', nameEn: 'Business', nameHi: 'व्यापार', icon: '🏢', color: '#8b5cf6' },
  { id: 'cat_health', nameEn: 'Health', nameHi: 'स्वास्थ्य', icon: '🏃', color: '#ef4444' },
  { id: 'cat_finance', nameEn: 'Finance', nameHi: 'वित्त', icon: '💰', color: '#f59e0b' },
  { id: 'cat_other', nameEn: 'Other', nameHi: 'अन्य', icon: '📝', color: '#64748b' },
];

export const DEFAULT_ROUTINES: RoutineItem[] = [
  { id: 'r_1', time: '06:00 AM', title: 'Wake Up & Fresh Air', icon: '🌅', categoryId: 'cat_health', isCompleted: true, order: 1 },
  { id: 'r_2', time: '06:30 AM', title: 'Exercise & Yoga', icon: '🧘', categoryId: 'cat_health', isCompleted: true, order: 2 },
  { id: 'r_3', time: '07:30 AM', title: 'Healthy Breakfast', icon: '🍳', categoryId: 'cat_health', isCompleted: true, order: 3 },
  { id: 'r_4', time: '09:00 AM', title: 'Work / Office Deep Focus', icon: '💻', categoryId: 'cat_work', isCompleted: true, order: 4 },
  { id: 'r_5', time: '01:00 PM', title: 'Lunch & Break', icon: '🥗', categoryId: 'cat_personal', isCompleted: false, order: 5 },
  { id: 'r_6', time: '02:00 PM', title: 'Important Work & Calls', icon: '📞', categoryId: 'cat_business', isCompleted: false, order: 6 },
  { id: 'r_7', time: '06:00 PM', title: 'Study & Skill Upgrade', icon: '📚', categoryId: 'cat_study', isCompleted: false, order: 7 },
  { id: 'r_8', time: '08:00 PM', title: 'Dinner with Family', icon: '🍽️', categoryId: 'cat_personal', isCompleted: false, order: 8 },
  { id: 'r_9', time: '10:00 PM', title: 'Sleep & Rest', icon: '😴', categoryId: 'cat_health', isCompleted: false, order: 9 },
];

export function getInitialTasks(): Task[] {
  const today = getTodayDateString();
  const tomorrow = getTodayDateString(1);
  return [
    {
      id: 'task_1',
      title: 'Check Emails & Morning Briefing',
      description: 'Review urgent client messages and mark priority tickets',
      date: today,
      startTime: '09:30',
      endTime: '10:00',
      priority: 'high',
      categoryId: 'cat_work',
      reminder: '10m',
      repeat: 'daily',
      isCompleted: true,
      completedAt: new Date().toISOString(),
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_2',
      title: 'Complete Office Project Milestones',
      description: 'Finalize the project presentation deck and submit proposal',
      date: today,
      startTime: '11:00',
      endTime: '13:00',
      priority: 'high',
      categoryId: 'cat_work',
      reminder: '30m',
      repeat: 'none',
      isCompleted: true,
      completedAt: new Date().toISOString(),
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_3',
      title: 'Study 2 Hours - New Framework',
      description: 'Practice TypeScript design patterns and state machines',
      date: today,
      startTime: '18:00',
      endTime: '20:00',
      priority: 'medium',
      categoryId: 'cat_study',
      reminder: '1h',
      repeat: 'daily',
      isCompleted: true,
      completedAt: new Date().toISOString(),
      order: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_4',
      title: 'Evening 30 Min Walk & Exercise',
      description: 'Outdoor cardio and fresh air recharge',
      date: today,
      startTime: '17:15',
      endTime: '17:45',
      priority: 'medium',
      categoryId: 'cat_health',
      reminder: '10m',
      repeat: 'daily',
      isCompleted: false,
      order: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_5',
      title: 'Update Daily Records & Expense Log',
      description: 'Review receipts and budget progress for the week',
      date: today,
      startTime: '21:00',
      endTime: '21:30',
      priority: 'low',
      categoryId: 'cat_finance',
      reminder: 'exact',
      repeat: 'daily',
      isCompleted: false,
      order: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_6',
      title: 'Weekly Team Review Meeting',
      description: 'Present team progress and sprint goals',
      date: tomorrow,
      startTime: '10:00',
      endTime: '11:00',
      priority: 'high',
      categoryId: 'cat_work',
      reminder: '30m',
      repeat: 'weekly',
      isCompleted: false,
      order: 6,
      createdAt: new Date().toISOString(),
    },
  ];
}

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user_default',
  name: 'Ekant Patel',
  email: 'ekantpatelpratappur@gmail.com',
  avatar: '👨‍💼',
  isGuest: false,
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  language: 'hi',
  notificationsEnabled: true,
  soundEnabled: true,
  startOfWeek: 'monday',
  morningReminderTime: '07:00',
  eveningSummaryTime: '21:00',
};

export const DEFAULT_STREAK: StreakData = {
  currentStreak: 4,
  longestStreak: 12,
  lastActiveDate: getTodayDateString(),
  history: {
    [getTodayDateString(-3)]: 5,
    [getTodayDateString(-2)]: 4,
    [getTodayDateString(-1)]: 6,
    [getTodayDateString(0)]: 3,
  },
};

// Storage helper functions
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      const initial = getInitialTasks();
      saveTasks(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialTasks();
  }
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

export function loadRoutine(): RoutineItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINE);
    if (!raw) {
      saveRoutine(DEFAULT_ROUTINES);
      return DEFAULT_ROUTINES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ROUTINES;
  }
}

export function saveRoutine(routine: RoutineItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routine));
  } catch (e) {
    console.error('Failed to save routine', e);
  }
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      saveProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!raw) {
      saveStreak(DEFAULT_STREAK);
      return DEFAULT_STREAK;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STREAK;
  }
}

export function saveStreak(streak: StreakData) {
  try {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
  } catch (e) {
    console.error('Failed to save streak', e);
  }
}

// Update streak when a task is completed today
export function recordTaskCompletion(streak: StreakData): StreakData {
  const today = getTodayDateString();
  const yesterday = getTodayDateString(-1);

  const updatedHistory = { ...streak.history };
  updatedHistory[today] = (updatedHistory[today] || 0) + 1;

  let currentStreak = streak.currentStreak;
  if (streak.lastActiveDate === today) {
    // already active today, continue
  } else if (streak.lastActiveDate === yesterday) {
    // consecutive day!
    currentStreak += 1;
  } else {
    // broken streak or fresh start
    currentStreak = 1;
  }

  const longestStreak = Math.max(streak.longestStreak, currentStreak);
  const updatedStreak: StreakData = {
    currentStreak,
    longestStreak,
    lastActiveDate: today,
    history: updatedHistory,
  };

  saveStreak(updatedStreak);
  return updatedStreak;
}

// Export all app data as a JSON file
export function exportAppData() {
  const data = {
    tasks: loadTasks(),
    routine: loadRoutine(),
    categories: loadCategories(),
    profile: loadProfile(),
    settings: loadSettings(),
    streak: loadStreak(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `daily-routine-backup-${getTodayDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import data from JSON object
export function importAppData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks) saveTasks(data.tasks);
    if (data.routine) saveRoutine(data.routine);
    if (data.categories) saveCategories(data.categories);
    if (data.profile) saveProfile(data.profile);
    if (data.settings) saveSettings(data.settings);
    if (data.streak) saveStreak(data.streak);
    return true;
  } catch (e) {
    console.error('Failed to import app data', e);
    return false;
  }
}

// Clear all data
export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.ROUTINE);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.STREAK);
}
