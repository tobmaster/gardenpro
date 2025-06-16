import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, TrendingUp, Users, Award, Star, BarChart3, Clock } from 'lucide-react';
import { User, WateringEntry, UserActivity } from '../types';
import { loadData } from '../utils/storage';
import { getUserName } from '../utils/watering';

interface StatisticsProps {
  user: User;
}

interface UserStats {
  userId: string;
  name: string;
  totalCompleted: number;
  totalPlanned: number;
  completionRate: number;
  streak: number;
  lastWatered: string | null;
}

interface DayStats {
  day: string;
  count: number;
  users: string[];
}

export const Statistics: React.FC<StatisticsProps> = ({ user }) => {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [dayStats, setDayStats] = useState<DayStats[]>([]);
  const [totalWaterings, setTotalWaterings] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const data = loadData();
    calculateStatistics(data);
  }, []);

  const calculateStatistics = (data: any) => {
    const completedEntries = data.wateringEntries.filter((e: WateringEntry) => e.status === 'completed');
    setTotalWaterings(completedEntries.length);
    setActiveUsers(data.users.length);

    // Calculate user statistics
    const userStatsMap = new Map<string, UserStats>();
    
    data.users.forEach((u: User) => {
      userStatsMap.set(u.id, {
        userId: u.id,
        name: u.name,
        totalCompleted: 0,
        totalPlanned: 0,
        completionRate: 0,
        streak: 0,
        lastWatered: null
      });
    });

    // Count completed and planned waterings
    data.wateringEntries.forEach((entry: WateringEntry) => {
      if (entry.status === 'completed' && entry.completedUserId) {
        const stats = userStatsMap.get(entry.completedUserId);
        if (stats) {
          stats.totalCompleted++;
          if (!stats.lastWatered || entry.date > stats.lastWatered) {
            stats.lastWatered = entry.date;
          }
        }
      }
      if (entry.status === 'planned' && entry.assignedUserId) {
        const stats = userStatsMap.get(entry.assignedUserId);
        if (stats) {
          stats.totalPlanned++;
        }
      }
    });

    // Calculate completion rates and streaks
    userStatsMap.forEach((stats) => {
      const totalCommitments = stats.totalCompleted + stats.totalPlanned;
      stats.completionRate = totalCommitments > 0 ? (stats.totalCompleted / totalCommitments) * 100 : 0;
      
      // Calculate current streak (simplified - consecutive days from most recent)
      const userCompletions = completedEntries
        .filter((e: WateringEntry) => e.completedUserId === stats.userId)
        .sort((a: WateringEntry, b: WateringEntry) => b.date.localeCompare(a.date));
      
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < userCompletions.length; i++) {
        const entryDate = new Date(userCompletions[i].date);
        const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === i) {
          streak++;
        } else {
          break;
        }
      }
      stats.streak = streak;
    });

    const sortedUserStats = Array.from(userStatsMap.values())
      .sort((a, b) => b.totalCompleted - a.totalCompleted);
    setUserStats(sortedUserStats);

    // Calculate day-of-week statistics
    const dayStatsMap = new Map<string, { count: number; users: Set<string> }>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    dayNames.forEach(day => {
      dayStatsMap.set(day, { count: 0, users: new Set() });
    });

    completedEntries.forEach((entry: WateringEntry) => {
      const date = new Date(entry.date);
      const dayName = dayNames[date.getDay()];
      const dayData = dayStatsMap.get(dayName);
      if (dayData && entry.completedUserId) {
        dayData.count++;
        dayData.users.add(entry.completedUserId);
      }
    });

    const sortedDayStats = Array.from(dayStatsMap.entries())
      .map(([day, data]) => ({
        day,
        count: data.count,
        users: Array.from(data.users).map(userId => getUserName(userId))
      }))
      .sort((a, b) => b.count - a.count);

    setDayStats(sortedDayStats);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Star className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{index + 1}</div>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Garden Statistics</h1>
        <p className="text-gray-600">Track performance and discover watering patterns</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Waterings</p>
              <p className="text-2xl font-bold text-gray-900">{totalWaterings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Gardeners</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Day</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalWaterings > 0 ? (totalWaterings / Math.max(dayStats.length, 1)).toFixed(1) : '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Trophy className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Top Performer</p>
              <p className="text-lg font-bold text-gray-900">
                {userStats.length > 0 ? userStats[0].name.split(' ')[0] : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Rankings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Watering Champions</h2>
              <p className="text-sm text-gray-500">Ranked by completed waterings</p>
            </div>
          </div>

          <div className="space-y-4">
            {userStats.map((stats, index) => (
              <div
                key={stats.userId}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  stats.userId === user.id 
                    ? 'border-emerald-200 bg-emerald-50' 
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getRankBadge(index)}`}>
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {stats.name}
                        {stats.userId === user.id && (
                          <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{stats.totalCompleted} completed</span>
                        <span>{stats.completionRate.toFixed(0)}% rate</span>
                        {stats.streak > 0 && (
                          <span className="text-orange-600 font-medium">
                            🔥 {stats.streak} streak
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCompleted}</p>
                    {stats.lastWatered && (
                      <p className="text-xs text-gray-500">
                        Last: {new Date(stats.lastWatered).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day of Week Analysis */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Popular Watering Days</h2>
              <p className="text-sm text-gray-500">When the garden gets the most attention</p>
            </div>
          </div>

          <div className="space-y-4">
            {dayStats.map((dayStat, index) => {
              const maxCount = Math.max(...dayStats.map(d => d.count));
              const percentage = maxCount > 0 ? (dayStat.count / maxCount) * 100 : 0;
              
              return (
                <div key={dayStat.day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          {dayStat.day.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{dayStat.day}</p>
                        <p className="text-xs text-gray-500">
                          {dayStat.users.length} gardener{dayStat.users.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{dayStat.count}</p>
                      <p className="text-xs text-gray-500">waterings</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {dayStat.users.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dayStat.users.slice(0, 3).map((userName, userIndex) => (
                        <span
                          key={userIndex}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {userName.split(' ')[0]}
                        </span>
                      ))}
                      {dayStat.users.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          +{dayStat.users.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};