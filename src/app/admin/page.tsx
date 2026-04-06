'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import type { FirestoreResult } from '@/lib/types';
import { ShieldAlert } from 'lucide-react';

// Note: Admin access is now primarily controlled by /admin/login (Username/Password)
// The UID whitelist below is kept as a legacy/secondary check.
const ADMIN_UIDS = (process.env.NEXT_PUBLIC_ADMIN_UIDS ?? '')
  .split(',')
  .map((uid) => uid.trim())
  .filter(Boolean);

interface ResultDoc extends FirestoreResult {
  id: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState<ResultDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth state is handled by middleware for route protection.
  // We only fetch data if the component is mounted.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'results'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as FirestoreResult),
        }));
        setResults(docs);
      } catch (e) {
        console.error('Failed to fetch admin data. Check Firestore rules.', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Middleware handles the admin-session check.
  // Content flash is prevented by the initial loading state.
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading Dashboard…</p>
        </div>
      </div>
    );
  }

  /** 
   * UID Whitelist Check (Optional)
   * If you still want to restrict even further to specific Firebase accounts, 
   * you can uncomment this block.
   */
  /*
  if (user && ADMIN_UIDS.length > 0 && !ADMIN_UIDS.includes(user.uid)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8 text-center">
        <div className="p-5 bg-red-100 dark:bg-red-900/20 rounded-full">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
        <p className="text-slate-500 max-w-sm">
          Your account does not have admin privileges. Contact the site administrator if you
          believe this is a mistake.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium"
        >
          Go Home
        </Link>
      </div>
    );
  }
  */

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading Dashboard…</p>
        </div>
      </div>
    );
  }

  // Aggregate gift counts
  const giftCounts: Record<string, number> = {};
  results.forEach((r) => {
    if (r.topGifts) {
      const topGifts = JSON.parse(r.topGifts) as string[];
      topGifts.forEach((g) => {
        giftCounts[g] = (giftCounts[g] || 0) + 1;
      });
    }
  });

  const sortedGifts = Object.entries(giftCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8 space-y-12 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-900 dark:from-primary-400 dark:to-primary-200">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">{results.length} total assessments completed</p>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Congregation Analytics</h2>
          <p className="text-sm text-slate-500 mb-6">
            Aggregate count of dominant gifts across all members.
          </p>

          <div className="space-y-3">
            {sortedGifts.length === 0 && <p className="text-sm text-slate-400">No data yet.</p>}
            {sortedGifts.map(([gift, count], index) => (
              <div
                key={gift}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/30 border border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-foreground">{gift}</span>
                </div>
                <span className="font-bold text-lg text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6">User Results</h2>
          <div className="space-y-4">
            {results.length === 0 && <p className="text-sm text-slate-400">No submissions yet.</p>}
            {results.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{r.userName || 'Unnamed User'}</h3>
                    <p className="text-sm text-slate-500">{r.userEmail}</p>
                  </div>
                  <Link
                    href={`/results/${r.id}`}
                    className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline shrink-0"
                  >
                    View Profile
                  </Link>
                </div>
                {r.topGifts ? (
                  <div className="mt-2 text-sm flex gap-2 flex-wrap">
                    {(JSON.parse(r.topGifts) as string[]).map((gift) => (
                      <span
                        key={gift}
                        className="px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium"
                      >
                        {gift}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mt-2">No assessment completed.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
