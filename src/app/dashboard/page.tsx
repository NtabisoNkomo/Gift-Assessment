'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClipboardList, Calendar, ChevronRight, User as UserIcon, Award, ArrowRight } from 'lucide-react';

interface AssessmentResult {
  id: string;
  createdAt: any;
  topGifts: string; // JSON string array
  userName: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'results'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedResults: AssessmentResult[] = [];
        querySnapshot.forEach((doc) => {
          fetchedResults.push({ id: doc.id, ...doc.data() } as AssessmentResult);
        });
        setResults(fetchedResults);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchResults();
    }
  }, [user, authLoading]);

  if (authLoading || (loading && user)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null; // Should be handled by middleware

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome, {user.displayName || 'User'}!</h1>
          <p className="opacity-90 font-medium">Explore your spiritual growth and view your unique giftings.</p>
        </div>
        <div className="relative z-10">
          <Link 
            href="/assessment" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-lg"
          >
            <ClipboardList className="w-5 h-5" /> Start New Assessment
          </Link>
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats / Profile Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <UserIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
               </div>
               <h2 className="font-bold text-xl">Your Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Email</label>
                <div className="font-medium text-slate-700 dark:text-slate-200">{user.email}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessments Completed</label>
                <div className="font-medium text-slate-700 dark:text-slate-200">{results.length}</div>
              </div>
            </div>
            
            {results.length > 0 && (
                <div className="pt-4 border-t border-border">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Primary Gift</label>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 rounded-lg font-bold">
                        <Award className="w-5 h-5" />
                        {JSON.parse(results[0].topGifts)[0]}
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Past Results</h2>
            <span className="text-sm font-medium text-slate-500">{results.length} Total</span>
          </div>

          {results.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <ClipboardList className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl">No assessments yet</h3>
                <p className="text-slate-500">Take your first assessment to discover your gifts!</p>
              </div>
              <Link 
                href="/assessment" 
                className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={`/results/${result.id}`}
                    className="flex flex-col md:flex-row md:items-center justify-between p-6 glass-panel rounded-2xl border border-border hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-border group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-400">
                          {result.createdAt?.toDate ? result.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </div>
                        <div className="text-lg font-bold flex flex-wrap gap-2 mt-1">
                          {JSON.parse(result.topGifts).slice(0, 3).map((gift: string, i: number) => (
                            <span key={i} className="text-primary-600 dark:text-primary-400">
                                {gift}{i < 2 && i < JSON.parse(result.topGifts).length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2 text-primary-600 font-bold text-sm bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                      View Full Details <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
