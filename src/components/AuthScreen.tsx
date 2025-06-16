import React, { useState } from 'react';
import { Mail, Leaf, Users, Calendar, Droplets } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, name: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onLogin(email, name);
  };

  const handleGoogleLogin = () => {
    // Simulate Google OAuth
    const mockGoogleUser = {
      email: 'user@gmail.com',
      name: 'Garden Enthusiast'
    };
    setEmail(mockGoogleUser.email);
    setName(mockGoogleUser.name);
    onLogin(mockGoogleUser.email, mockGoogleUser.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-emerald-600 to-green-700 p-8 lg:p-12 flex flex-col justify-center text-white">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Leaf className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold">GardenSync</h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Collaborative Garden Care Made Simple
            </h2>
            
            <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
              Coordinate watering schedules with your gardening community. Never let your plants go thirsty again.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <span>Collaborate with other gardeners</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <span>7-day watering calendar</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Droplets className="w-5 h-5" />
                </div>
                <span>Track watering completion</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h3>
              <p className="text-gray-600">Sign in to manage your garden community</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@gmail.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <button
                onClick={handleGoogleLogin}
                className="w-full mt-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <Mail className="w-5 h-5 text-red-500" />
                Continue with Gmail
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};