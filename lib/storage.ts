// Local storage utilities for client-side only

export interface UserPreferences {
  tone: 'formal' | 'neutral' | 'friendly';
  domain: 'engineering' | 'product' | 'general' | 'sales' | 'support';
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface DailyProgress {
  date: string;
  completed: number;
  total: number;
  streak: number;
  lastCompletedDate: string;
}

const STORAGE_KEYS = {
  PREFERENCES: 'prowriter_preferences',
  DAILY_PROGRESS: 'prowriter_daily_progress',
  DAILY_TASKS: 'prowriter_daily_tasks',
};

export const storage = {
  // Preferences
  getPreferences: (): UserPreferences | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : null;
  },
  
  setPreferences: (prefs: UserPreferences) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },
  
  // Daily Progress
  getDailyProgress: (): DailyProgress | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    return data ? JSON.parse(data) : null;
  },
  
  setDailyProgress: (progress: DailyProgress) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
  },
  
  // Daily Tasks
  getDailyTasks: () => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
    return data ? JSON.parse(data) : null;
  },
  
  setDailyTasks: (tasks: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(tasks));
  },
  
  // Clear all data
  clearAll: () => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};
