'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { ArrowRight, Sparkles, LogIn, UserPlus, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-6xl mx-auto space-y-16 py-20 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-8 relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex p-3 bg-white/5 dark:bg-white/10 shadow-2xl rounded-[3.5rem] mb-10 border border-white/20 group hover:border-primary-500/50 transition-colors"
        >
           <div className="w-44 h-44 rounded-[3rem] overflow-hidden relative shadow-inner">
              <img src="/logo.png" alt="Spiritual Gifts Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
           </div>
        </motion.div>
        
        <h1 className="text-6xl md:text-9xl font-black tracking-tight leading-none text-gradient pb-6 filter drop-shadow-sm">
          Identify Your<br/>Purpose
        </h1>
        
        <p className="text-xl md:text-3xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium opacity-90">
          The Spiritual Gifts Assessment identifies the unique areas where you are <span className="text-primary-600 dark:text-primary-400 font-bold">best equipped</span> to serve and grow.
        </p>
      </motion.div>

      {user ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-8 w-full max-w-2xl px-4"
        >
          <div className="glass-panel-heavy p-10 rounded-[2.5rem] border border-white/30 dark:border-white/10 w-full relative group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">Welcome Back</div>
            <h2 className="text-3xl font-bold mb-3 text-foreground">Hello, {user.displayName || 'Friend'}!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">Your spiritual growth continues today.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link 
                href="/dashboard" 
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-black rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xl hover:shadow-2xl border border-border group/btn"
              >
                <LayoutDashboard className="w-6 h-6 text-primary-500 group-hover/btn:rotate-6 transition-transform" /> Visit Dashboard
              </Link>
              <Link 
                href="/assessment" 
                className="flex items-center justify-center gap-3 px-8 py-5 bg-primary-600 text-white font-black rounded-3xl hover:bg-primary-700 transition-all shadow-xl hover:shadow-primary-500/40 group/btn"
              >
                Start Assessment <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-8 justify-center w-full max-w-2xl mx-auto px-4"
        >
          <Link 
            href="/register" 
            className="flex-1 flex items-center justify-center gap-3 px-10 py-6 text-2xl font-black text-white bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 rounded-[2rem] hover:scale-105 transition-all shadow-2xl premium-shadow group"
          >
            <UserPlus className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="flex-1 flex items-center justify-center gap-3 px-10 py-6 text-2xl font-black text-slate-800 dark:text-white glass-panel rounded-[2rem] hover:bg-white/40 dark:hover:bg-white/10 transition-all shadow-xl group"
          >
            <LogIn className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
            Login
          </Link>
        </motion.div>
      )}

      {/* Enhanced Social Proof / Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pt-20 grid grid-cols-2 md:grid-cols-3 gap-12 w-full max-w-4xl"
      >
        <div className="flex flex-col items-center group cursor-default">
          <span className="text-4xl md:text-6xl font-black text-slate-800 dark:text-slate-200 group-hover:text-primary-500 transition-colors">130+</span>
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mt-2">Questions</span>
          <div className="h-1 w-12 bg-primary-500/20 rounded-full mt-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
        </div>
        <div className="flex flex-col items-center group cursor-default">
          <span className="text-4xl md:text-6xl font-black text-slate-800 dark:text-slate-200 group-hover:text-gold-500 transition-colors">20+</span>
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mt-2">Gift Areas</span>
          <div className="h-1 w-12 bg-gold-500/20 rounded-full mt-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
        </div>
        <div className="flex flex-col items-center col-span-2 md:col-span-1 group cursor-default">
          <span className="text-4xl md:text-6xl font-black text-slate-800 dark:text-slate-200 group-hover:text-primary-500 transition-colors">15m</span>
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mt-2">To Finish</span>
          <div className="h-1 w-12 bg-primary-500/20 rounded-full mt-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
        </div>
      </motion.div>
    </div>

  );
}
