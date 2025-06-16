import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import { User, WateringEntry, UserActivity } from '../types';
import { CalendarDay } from './CalendarDay';
import { ActivityLog } from './ActivityLog';
import { getDateRange } from '../utils/storage';
import { getWateringEntry, planWatering, completeWatering, cancelWatering } from '../utils/watering';
import { loadData } from '../utils/storage';
import { triggerConfetti } from '../utils/confetti';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [wateringEntries, setWateringEntries] = useState<WateringEntry[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = previous week, etc.
  
  const dates = getDateRange(7, weekOffset * 7);
  const today = new Date().toISOString().split('T')[0];
  
  const refreshData = () => {
    const data = loadData();
    setWateringEntries(data.wateringEntries);
    setActivities(data.activities);
    setTotalUsers(data.users.length);
  };
  
  useEffect(() => {
    refreshData();
  }, []);
  
  const handlePlan = (date: string) => {
    planWatering(date, user.id);
    refreshData();
  };
  
  const handleComplete = (date: string) => {
    completeWatering(date, user.id);
    // Trigger confetti animation when completing watering
    triggerConfetti();
    refreshData();
  };
  
  const handleCancel = (date: string) => {
    cancelWatering(date, user.id);
    refreshData();
  };
  
  const getStats = () => {
    const completed = wateringEntries.filter(e => e.status === 'completed').length;
    const planned = wateringEntries.filter(e => e.status === 'planned').length;
    const currentWeekDates = getDateRange(7, 0); // Always show current week stats
    const weekCompleted = wateringEntries.filter(e => 
      e.status === 'completed' && currentWeekDates.includes(e.date)
    ).length;
    
    return { completed, planned, weekCompleted };
  };
  
  const stats = getStats();
  
  const getWeekLabel = () => {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[6]);
    
    if (weekOffset === 0) {
      return 'This Week';
    } else if (weekOffset === -1) {
      return 'Last Week';
    } else if (weekOffset < -1) {
      return `${Math.abs(weekOffset)} weeks ago`;
    } else if (weekOffset === 1) {
      return 'Next Week';
    } else {
      return `${weekOffset} weeks ahead`;
    }
  };
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setWeekOffset(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };
  
  const goToCurrentWeek = () => {
    setWeekOffset(0);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Let's keep your garden thriving with collaborative care.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Droplets className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats.weekCompleted}/7</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Planned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.planned}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gardeners</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">7-Day Watering Calendar</h2>
              <p className="text-sm text-gray-500">Plan and track your garden watering schedule</p>
            </div>
          </div>
          
          {/* Calendar Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Previous week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center min-w-[120px]">
              <p className="text-sm font-semibold text-gray-900">{getWeekLabel()}</p>
              <p className="text-xs text-gray-500">
                {new Date(dates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(dates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Next week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Current Week Button */}
        {weekOffset !== 0 && (
          <div className="flex justify-center mb-4">
            <button
              onClick={goToCurrentWeek}
              className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              Go to Current Week
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {dates.map((date) => {
            const entry = getWateringEntry(date);
            const isToday = date === today;
            const isPast = new Date(date) < new Date(today);
            
            return (
              <CalendarDay
                key={date}
                date={date}
                entry={entry}
                isToday={isToday}
                isPast={isPast}
                currentUserId={user.id}
                onPlan={() => handlePlan(date)}
                onComplete={() => handleComplete(date)}
                onCancel={() => handleCancel(date)}
              />
            );
          })}
        </div>
      </div>
      
      {/* Activity Log */}
      <ActivityLog activities={activities} />
    </div>
  );
};