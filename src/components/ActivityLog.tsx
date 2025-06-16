import React from 'react';
import { Activity, CheckCircle, Clock, X, User, Calendar } from 'lucide-react';
import { UserActivity } from '../types';
import { getUserName } from '../utils/watering';

interface ActivityLogProps {
  activities: UserActivity[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'planned':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };
  
  const getActivityText = (activity: UserActivity) => {
    const userName = getUserName(activity.userId);
    const date = new Date(activity.date).toLocaleDateString();
    
    switch (activity.action) {
      case 'completed':
        return `${userName} completed watering for ${date}`;
      case 'planned':
        return `${userName} planned to water on ${date}`;
      case 'cancelled':
        return `${userName} cancelled watering plan for ${date}`;
      default:
        return `${userName} performed an action`;
    }
  };
  
  const recentActivities = activities.slice(0, 10);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl">
          <Activity className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500">Latest garden maintenance updates</p>
        </div>
      </div>
      
      {recentActivities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400">Start planning or completing watering tasks</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {getActivityText(activity)}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};