'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import ThemeToggle from './ThemeToggle';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, ClipboardList, ShieldCheck } from 'lucide-react';

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      if (pathname.startsWith('/admin')) {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
      } else {
        await signOut(auth);
        // Synchronize session cookie
        document.cookie = 'auth-session=; path=/; max-age=0';
        router.push('/login');
      }
      router.refresh();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (loading) return (
    <header className="p-4 flex justify-between items-center border-b border-border/50 bg-background/50 backdrop-blur-lg sticky top-0 z-50">
      <h1 className="text-xl font-semibold text-primary-600 dark:text-primary-400">Spiritual Gifts</h1>
      <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
    </header>
  );

  return (
    <header className="p-4 flex justify-between items-center border-b border-border/50 bg-background/50 backdrop-blur-lg sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform bg-white/10">
           <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-gold-500 tracking-tight">
          Spiritual Gifts
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {pathname.startsWith('/admin') && pathname !== '/admin/login' ? (
          <>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" /> Admin Logout
            </button>
          </>
        ) : user ? (
          <>
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-500 ${pathname === '/dashboard' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link 
              href="/assessment" 
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-500 ${pathname === '/assessment' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Assessment</span>
            </Link>
            <div className="h-6 w-px bg-border/50 mx-2 hidden sm:block" />
            <div className="flex items-center gap-3">
               <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-xs font-bold text-foreground leading-none">{user.displayName || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground leading-none">{user.email}</span>
               </div>
               <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
                title="Logout"
               >
                <LogOut className="w-5 h-5" />
               </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
             <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                Sign In
             </Link>
             <Link href="/register" className="px-4 py-1.5 bg-primary-600 text-white text-sm font-bold rounded-full hover:bg-primary-700 transition-all shadow-md">
                Get Started
             </Link>
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
