import { WateringEntry, UserActivity, AppData } from '../types';
import { loadData, saveData, generateId } from './storage';

export const getWateringEntry = (date: string): WateringEntry => {
  const data = loadData();
  let entry = data.wateringEntries.find(e => e.date === date);
  
  if (!entry) {
    entry = {
      id: generateId(),
      date,
      status: 'unassigned'
    };
    data.wateringEntries.push(entry);
    saveData(data);
  }
  
  return entry;
};

export const planWatering = (date: string, userId: string): void => {
  const data = loadData();
  const entryIndex = data.wateringEntries.findIndex(e => e.date === date);
  
  if (entryIndex >= 0) {
    data.wateringEntries[entryIndex] = {
      ...data.wateringEntries[entryIndex],
      status: 'planned',
      assignedUserId: userId,
      plannedAt: new Date().toISOString()
    };
  } else {
    data.wateringEntries.push({
      id: generateId(),
      date,
      status: 'planned',
      assignedUserId: userId,
      plannedAt: new Date().toISOString()
    });
  }
  
  // Add activity
  data.activities.unshift({
    id: generateId(),
    userId,
    action: 'planned',
    date,
    timestamp: new Date().toISOString()
  });
  
  saveData(data);
};

export const completeWatering = (date: string, userId: string): void => {
  const data = loadData();
  const entryIndex = data.wateringEntries.findIndex(e => e.date === date);
  
  if (entryIndex >= 0) {
    data.wateringEntries[entryIndex] = {
      ...data.wateringEntries[entryIndex],
      status: 'completed',
      completedUserId: userId,
      completedAt: new Date().toISOString()
    };
  } else {
    data.wateringEntries.push({
      id: generateId(),
      date,
      status: 'completed',
      completedUserId: userId,
      completedAt: new Date().toISOString()
    });
  }
  
  // Add activity
  data.activities.unshift({
    id: generateId(),
    userId,
    action: 'completed',
    date,
    timestamp: new Date().toISOString()
  });
  
  saveData(data);
};

export const cancelWatering = (date: string, userId: string): void => {
  const data = loadData();
  const entryIndex = data.wateringEntries.findIndex(e => e.date === date);
  
  if (entryIndex >= 0) {
    data.wateringEntries[entryIndex] = {
      ...data.wateringEntries[entryIndex],
      status: 'unassigned',
      assignedUserId: undefined,
      plannedAt: undefined
    };
  }
  
  // Add activity
  data.activities.unshift({
    id: generateId(),
    userId,
    action: 'cancelled',
    date,
    timestamp: new Date().toISOString()
  });
  
  saveData(data);
};

export const getUserName = (userId: string): string => {
  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  return user?.name || 'Unknown User';
};