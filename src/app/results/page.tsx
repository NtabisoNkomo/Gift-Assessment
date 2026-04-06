'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { calculateScores } from '@/lib/scoring';
import { GiftCard } from '@/components/GiftCard';
import { RadarAnalysis, BarAnalysis } from '@/components/ResultsChart';
import { useAuth } from '@/components/AuthProvider';
import { BookmarkPlus, LogIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [saving, setSaving] = useState(false);
  const { answers, reset } = useAssessmentStore();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const results = useMemo(() => {
    if (Object.keys(answers).length === 0) return null;
    return calculateScores(answers);
  }, [answers]);

  if (!mounted) return null;

  if (!results) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
        <h2 className="text-2xl font-bold text-foreground">No results found</h2>
        <p className="text-slate-500">Please complete the assessment first.</p>
        <Link
          href="/assessment"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Go to Assessment
        </Link>
      </div>
    );
  }

  const { primaryGifts, secondaryGifts, allScores } = results;
  const isAnonymous = !authLoading && !user;

  const handleSaveResults = async () => {
    if (!user || saving) return;
    setSaving(true);
    try {
      const topGiftsStr = JSON.stringify(primaryGifts.map((g) => g.gift.name));
      const docRef = await addDoc(collection(db, 'results'), {
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        userEmail: user.email,
        answers: JSON.stringify(answers),
        topGifts: topGiftsStr,
        createdAt: serverTimestamp(),
      });
      reset();
      router.push(`/results/${docRef.id}`);
    } catch (e) {
      console.error('Failed to save', e);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8 space-y-16 py-12">
      {/* Save Results Banner — shown to anonymous users who still have results in memory */}
      <AnimatePresence>
        {isAnonymous && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-panel rounded-2xl p-5 border border-gold-400/40 bg-gold-50/60 dark:bg-gold-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gold-100 dark:bg-gold-900/30 rounded-xl shrink-0">
                <BookmarkPlus className="w-6 h-6 text-gold-600 dark:text-gold-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Your results are temporary</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Create a free account to save your profile, get a shareable link, and download a PDF report.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-gold-500 text-white font-semibold rounded-xl hover:scale-105 transition-all shadow-md text-sm"
              >
                <LogIn className="w-4 h-4" />
                Save My Results
              </Link>
              <button
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss banner"
                className="p-2 text-slate-400 hover:text-foreground transition rounded-lg hover:bg-white/30 dark:hover:bg-black/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* If user just logged in and still has answers, offer to persist */}
      <AnimatePresence>
        {!isAnonymous && !authLoading && user && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-panel rounded-2xl p-5 border border-primary-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl shrink-0">
                <BookmarkPlus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Save to your account</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  You&apos;re logged in as <strong>{user.displayName || user.email}</strong>. Save your results to get a permanent link and PDF.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleSaveResults}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-gold-500 text-white font-semibold rounded-xl hover:scale-105 transition-all shadow-md text-sm disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save & Get Link'}
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss banner"
                className="p-2 text-slate-400 hover:text-foreground transition rounded-lg hover:bg-white/30 dark:hover:bg-black/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-gold-400 pb-2">
          Your Spiritual Gifts Profile
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Based on your responses, these are the areas where God has uniquely equipped you to serve the church.
        </p>
      </div>

      {/* Top 3 Gifts (Primary) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3 border-b border-border pb-4">
          Primary Gifts
          <span className="text-sm font-bold text-primary-700 bg-primary-100 dark:bg-primary-900/50 dark:text-primary-300 px-3 py-1 rounded-full uppercase tracking-wider">
            Top 3
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {primaryGifts.map((score, idx) => (
            <GiftCard key={score.gift.id} giftScore={score} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* Radar Chart */}
      <section className="bg-card border border-border p-4 md:p-8 rounded-3xl shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Gifts Constellation</h2>
          <p className="text-slate-500 text-sm mt-2">Visual harmony of your Top 6 prominent gifts</p>
        </div>
        <RadarAnalysis data={[...primaryGifts, ...secondaryGifts]} />
      </section>

      {/* Secondary Gifts */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3 border-b border-border pb-4">
          Secondary Gifts
          <span className="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
            Next 3
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90">
          {secondaryGifts.map((score, idx) => (
            <GiftCard key={score.gift.id} giftScore={score} rank={idx + 4} />
          ))}
        </div>
      </section>

      {/* Full Ranking Chart */}
      <section className="bg-card border border-border p-4 md:p-8 rounded-3xl shadow-sm">
        <div className="mb-8 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground">Complete Analysis</h2>
          <p className="text-slate-500 text-sm mt-2">
            Relative strength of all 26 spiritual gifts based on your answers.
          </p>
        </div>
        <BarAnalysis data={allScores} />
      </section>
    </div>
  );
}
