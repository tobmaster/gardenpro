import { AppData, User, WateringEntry, UserActivity } from '../types';

const STORAGE_KEY = 'garden-maintenance-app';

const defaultData: AppData = {
  users: [],
  currentUserId: null,
  wateringEntries: [],
  activities: []
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return defaultData;
  }
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const getCurrentUser = (): User | null => {
  const data = loadData();
  if (!data.currentUserId) return null;
  return data.users.find(user => user.id === data.currentUserId) || null;
};

export const loginUser = (email: string, name: string): User => {
  const data = loadData();
  
  // Check if user already exists
  let user = data.users.find(u => u.email === email);
  
  if (!user) {
    // Create new user
    user = {
      id: generateId(),
      email,
      name,
      joinDate: new Date().toISOString(),
      avatar: `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`
    };
    data.users.push(user);
  }
  
  data.currentUserId = user.id;
  saveData(data);
  return user;
};

export const logoutUser = (): void => {
  const data = loadData();
  data.currentUserId = null;
  saveData(data);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDateRange = (days: number = 7, offsetDays: number = 0): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i + offsetDays);
    dates.push(formatDate(date));
  }
  
  return dates;
};