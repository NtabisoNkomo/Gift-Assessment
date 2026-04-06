'use client';

import { useState, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Set a session cookie so Next.js middleware can detect authenticated state
      document.cookie = 'auth-session=1; path=/; SameSite=Lax; max-age=86400';
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 rounded-2xl relative z-10 border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/30 dark:bg-black/30 shadow-2xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
             <div className="bg-red-500/20 border border-red-500/50 text-red-500 p-3 rounded-xl text-center text-sm">
                {error}
             </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Register here
            </Link>
          </p>
          <div className="pt-2 border-t border-white/10">
            <Link href="/admin/login" className="text-xs font-semibold text-slate-500 hover:text-primary-500 transition-colors uppercase tracking-wider">
              Login as Administrator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
