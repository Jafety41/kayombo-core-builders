import React, { useState } from 'react';
import { Building2, Lock, User, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function AdminLogin({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || 'Invalid admin credentials. Please try again.');
      setIsLoading(false);
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] md:text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-900 transition-colors mb-8 mx-auto md:mx-0"
        >
          <ArrowLeft className="w-4 h-4" /> Back to website
        </button>
        
        <div className="flex justify-center mb-4 md:mb-6">
          <img src="/images/logo-optimized.webp" alt="Kayombo Core Builders Company" className="h-16 w-auto object-contain" />
        </div>
        
        <h2 className="text-center text-2xl md:text-3xl font-extrabold tracking-tighter text-gray-900">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm md:text-base text-gray-500 font-medium px-4">
          Enter your admin credentials to access the dashboard
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 w-full max-w-md mx-auto"
      >
        <div className="bg-white p-6 md:p-12 shadow-2xl border border-gray-100 rounded-[32px] md:rounded-[40px]">
          <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-4 md:py-4.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-900 placeholder-gray-400 text-sm md:text-base"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-4 md:py-4.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-900 placeholder-gray-400 text-sm md:text-base"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-3 text-[10px] font-bold text-red-500 uppercase tracking-widest"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 md:py-5 px-4 border border-transparent rounded-full shadow-xl shadow-blue-900/10 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
