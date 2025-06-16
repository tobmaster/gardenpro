import React from 'react';
import { CheckCircle, Clock, AlertCircle, Droplets, User, Calendar, Plus } from 'lucide-react';
import { WateringEntry } from '../types';
import { getUserName } from '../utils/watering';

interface CalendarDayProps {
  date: string;
  entry: WateringEntry;
  isToday: boolean;
  isPast: boolean;
  currentUserId: string;
  onPlan: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  entry,
  isToday,
  isPast,
  currentUserId,
  onPlan,
  onComplete,
  onCancel
}) => {
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
  
  const isAssignedToCurrentUser = entry.assignedUserId === currentUserId;
  const canPlan = entry.status === 'unassigned' && !isPast && !isToday;
  const canComplete = entry.status === 'planned' && isAssignedToCurrentUser && (isToday || isPast);
  const canCancel = entry.status === 'planned' && isAssignedToCurrentUser && !isPast;
  const canLogPastWatering = isPast && entry.status === 'unassigned';
  const canLogTodayWatering = isToday && entry.status === 'unassigned';
  
  const getStatusConfig = () => {
    switch (entry.status) {
      case 'completed':
        return {
          bgColor: 'bg-emerald-50 border-emerald-200',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          badgeText: 'Completed'
        };
      case 'planned':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          icon: <Clock className="w-5 h-5 text-blue-600" />,
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          badgeText: 'Planned'
        };
      default:
        return {
          bgColor: isPast ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200',
          icon: <AlertCircle className={`w-5 h-5 ${isPast ? 'text-red-600' : 'text-gray-400'}`} />,
          badge: isPast ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200',
          badgeText: isPast ? 'Missed' : 'Unassigned'
        };
    }
  };
  
  const statusConfig = getStatusConfig();
  
  return (
    <div className={`rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-md ${statusConfig.bgColor} ${isToday ? 'ring-2 ring-emerald-300 ring-opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">{dayName}</p>
            <p className="text-lg font-bold text-gray-900">{dayNumber}</p>
            <p className="text-xs text-gray-500">{monthName}</p>
          </div>
          {isToday && (
            <div className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
              Today
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {statusConfig.icon}
          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusConfig.badge}`}>
            {statusConfig.badgeText}
          </span>
        </div>
      </div>
      
      {entry.status !== 'unassigned' && (
        <div className="mb-3 p-3 bg-white/70 rounded-lg">
          {entry.status === 'completed' && entry.completedUserId && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {getUserName(entry.completedUserId)}
                </span>
              </div>
              {entry.completedAt && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(entry.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {entry.status === 'planned' && entry.assignedUserId && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {getUserName(entry.assignedUserId)}
                </span>
              </div>
              {entry.plannedAt && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Planned {new Date(entry.plannedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        {canPlan && (
          <button
            onClick={onPlan}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            <Droplets className="w-4 h-4" />
            Plan to Water
          </button>
        )}
        
        {canComplete && (
          <button
            onClick={onComplete}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            <CheckCircle className="w-4 h-4" />
            Mark Complete
          </button>
        )}
        
        {canLogTodayWatering && (
          <button
            onClick={onComplete}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            <Droplets className="w-4 h-4" />
            Log Watering
          </button>
        )}
        
        {canLogPastWatering && (
          <button
            onClick={onComplete}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Log Watering
          </button>
        )}
        
        {canCancel && (
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            Cancel Plan
          </button>
        )}
      </div>
    </div>
  );
};