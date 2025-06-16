import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Statistics } from './components/Statistics';
import { User } from './types';
import { getCurrentUser, loginUser, logoutUser } from './utils/storage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'statistics'>('dashboard');

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string, name: string) => {
    const loggedInUser = loginUser(email, name);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleViewChange = (view: 'dashboard' | 'statistics') => {
    setCurrentView(view);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GardenSync...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      {currentView === 'dashboard' ? (
        <Dashboard user={user} />
      ) : (
        <Statistics user={user} />
      )}
    </div>
  );
}

export default App;