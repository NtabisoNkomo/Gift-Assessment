'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        // Set a session cookie so Next.js middleware can detect authenticated state
        document.cookie = 'auth-session=1; path=/; SameSite=Lax; max-age=86400';
        router.push('/');
        router.refresh();
      }
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Something went wrong';
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
            Create an account
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
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                autoComplete="new-password"
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
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
