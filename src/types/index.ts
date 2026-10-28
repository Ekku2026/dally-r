export type Priority = 'low' | 'medium' | 'high';

export type TaskRepeat = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export type ReminderOption = 'none' | '10m' | '30m' | '1h' | 'exact';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  priority: Priority;
  categoryId: string;
  reminder: ReminderOption;
  repeat: TaskRepeat;
  isCompleted: boolean;
  completedAt?: string;
  order: number;
  createdAt: string;
}

export interface RoutineItem {
  id: string;
  time: string; // "06:00 AM" or "06:00"
  title: string;
  icon?: string;
  categoryId: string;
  isCompleted: boolean;
  completedAt?: string;
  order: number;
}

export interface Category {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  color: string; // hex or tailwind color class
  isCustom?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isGuest?: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'hi' | 'en';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  startOfWeek: 'monday' | 'sunday';
  morningReminderTime: string; // HH:mm
  eveningSummaryTime: string; // HH:mm
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  history: Record<string, number>; // date -> number of completed tasks
}

export type ActiveTab = 'dashboard' | 'tasks' | 'routine' | 'calendar' | 'analytics' | 'profile' | 'download';
