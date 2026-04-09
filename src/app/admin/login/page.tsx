'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { getClientIp, signAdminToken } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Capture Client IP (Standalone/APK)
      const ip = await getClientIp();
      
      // 2. Local credential check (Standalone mode)
      // Note: In production, these should be handled securely.
      const correctUser = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
      const correctPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123';

      if (username === correctUser && password === correctPass) {
        // 3. Create Session Token (JWT)
        const token = await signAdminToken({
          username,
          ip,
          role: 'admin'
        });

        // 4. Store session for standalone APK
        localStorage.setItem('admin-session', token);
        
        // Also set a standard cookie for browser compatibility
        document.cookie = `admin-session=${token}; path=/; max-age=86400; SameSite=Lax`;

        // 5. Log Activity directly to Firestore (via app-level SDK)
        try {
          const { db } = await import('@/lib/firebase');
          const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
          await addDoc(collection(db, 'admin_logs'), {
            username,
            ip,
            status: 'success',
            userAgent: navigator.userAgent,
            timestamp: serverTimestamp(),
            action: 'standalone_login'
          });
        } catch (logErr) {
          console.error("Non-critical logging error:", logErr);
        }

        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl bg-white/30 dark:bg-black/30">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 bg-white/5 relative">
             <Image 
                src="/logo.png" 
                alt="Admin Logo" 
                fill
                className="object-cover" 
             />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground pt-2">
            Admin Access
          </h2>
          <p className="text-sm font-medium text-slate-500/80 uppercase tracking-[0.2em]">
            Authorized Personnel Only
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-xl border-border bg-white/50 dark:bg-black/50 px-4 py-3 text-foreground focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all outline-none"
                placeholder="Enter admin username"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 ml-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border-border bg-white/50 dark:bg-black/50 px-4 py-3 text-foreground focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-primary-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-primary-500/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Login as Administrator'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
