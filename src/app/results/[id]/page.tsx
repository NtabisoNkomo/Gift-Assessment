'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { calculateScores } from '@/lib/scoring';
import { GiftCard } from '@/components/GiftCard';
import { RadarAnalysis, BarAnalysis } from '@/components/ResultsChart';
import Link from 'next/link';
import { ActionBar } from '@/components/ActionBar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FirestoreResult } from '@/lib/types';

type ResultState = (FirestoreResult & { id: string }) | 'NOT_FOUND' | null;

export default function SharedResultPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<ResultState>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const docRef = doc(db, 'results', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResult({ id: docSnap.id, ...(docSnap.data() as FirestoreResult) });
        } else {
          setResult('NOT_FOUND');
        }
      } catch {
        setResult('NOT_FOUND');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (result === 'NOT_FOUND') return notFound();

  const answers = JSON.parse((result as FirestoreResult & { id: string }).answers) as Record<number, number>;
  const { primaryGifts, secondaryGifts, allScores } = calculateScores(answers);
  const typedResult = result as FirestoreResult & { id: string };

  return (
    <div className="relative">
      <ActionBar shareId={params.id} />
      <div id="pdf-content" className="max-w-6xl mx-auto w-full p-4 md:p-8 space-y-16 py-12 bg-background">
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-gold-400 pb-2">
            {typedResult.userName ? `${typedResult.userName}'s` : 'Shared'} Spiritual Gifts Profile
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            These are the areas where God has uniquely equipped{' '}
            {typedResult.userName || 'this person'} to serve the church.
          </p>
        </div>

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

        <section className="bg-card border border-border p-4 md:p-8 rounded-3xl shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Gifts Constellation</h2>
            <p className="text-slate-500 text-sm mt-2">Visual harmony of the Top 6 prominent gifts</p>
          </div>
          <RadarAnalysis data={[...primaryGifts, ...secondaryGifts]} />
        </section>

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

        <section className="bg-card border border-border p-4 md:p-8 rounded-3xl shadow-sm">
          <div className="mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold text-foreground">Complete Analysis</h2>
            <p className="text-slate-500 text-sm mt-2">
              Relative strength of all 26 spiritual gifts.
            </p>
          </div>
          <BarAnalysis data={allScores} />
        </section>

        <div className="text-center pt-8 border-t border-border">
          <p className="text-slate-500 mb-4">Want to discover your own spiritual gifts?</p>
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Take the Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
