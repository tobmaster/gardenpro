export interface User {
  id: string;
  email: string;
  name: string;
  joinDate: string;
  avatar?: string;
}

export interface WateringEntry {
  id: string;
  date: string;
  status: 'completed' | 'planned' | 'unassigned';
  assignedUserId?: string;
  completedUserId?: string;
  completedAt?: string;
  plannedAt?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'planned' | 'completed' | 'cancelled';
  date: string;
  timestamp: string;
}

export interface AppData {
  users: User[];
  currentUserId: string | null;
  wateringEntries: WateringEntry[];
  activities: UserActivity[];
}