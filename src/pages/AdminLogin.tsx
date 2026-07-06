import React, { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const storedPassword = localStorage.getItem('adminPassword') || 'KAYOMBO123%';

    setTimeout(() => {
      if (password === storedPassword) {
        onLogin();
      } else {
        setError('Invalid admin password. Please try again.');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-blue-900/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] md:text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-900 transition-colors mb-6 md:mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to website
        </button>
        
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="Kayombo Core Builders Company" className="h-14 md:h-16 w-auto object-contain drop-shadow-sm" />
        </div>
        
        <h2 className="text-center text-2xl md:text-3xl font-extrabold tracking-tighter text-gray-900 mb-2">
          Admin Portal
        </h2>
        <p className="text-center text-xs md:text-sm text-gray-500 font-medium px-4 mb-8 max-w-[280px] md:max-w-none mx-auto leading-relaxed">
          Enter your secure password to access the administrative dashboard
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="bg-white p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-[28px] md:rounded-[36px]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
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
                    className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all text-gray-900 placeholder-gray-400 text-sm md:text-base bg-gray-50/50 focus:bg-white"
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
                    className="mt-3 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center h-14 md:h-16 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-900/20 text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
