'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { assessmentQuestions } from '@/data/questions';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { calculateScores } from '@/lib/scoring';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const QUESTIONS_PER_PAGE = 13;
const TOTAL_PAGES = Math.ceil(assessmentQuestions.length / QUESTIONS_PER_PAGE);

export default function AssessmentPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { answers, setAnswer, reset } = useAssessmentStore();

  const currentQuestions = useMemo(() => {
    const start = currentPage * QUESTIONS_PER_PAGE;
    return assessmentQuestions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [currentPage]);

  // Reset assessment on load (as requested)
  useEffect(() => {
    reset();
  }, [reset]);

  const allAnswered = currentQuestions.every(q => answers[q.id] !== undefined);
  const totalAnswered = Object.keys(answers).length;
  const progressPercent = Math.round((totalAnswered / assessmentQuestions.length) * 100);

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      if (window.confirm('Create an account to save and share your results. Click OK to register, or Cancel to view results anonymously.')) {
        router.push('/register');
        return;
      }
    } else {
      setIsSubmitting(true);
      try {
        const { primaryGifts } = calculateScores(answers);
        const topGiftsStr = JSON.stringify(primaryGifts.map(g => g.gift.name));

        const docRef = await addDoc(collection(db, 'results'), {
          userId: user.uid,
          userName: user.displayName || user.email || 'Anonymous',
          userEmail: user.email,
          answers: JSON.stringify(answers),
          topGifts: topGiftsStr,
          createdAt: serverTimestamp()
        });

        const resultId = docRef.id;

        // Fire email notification
        fetch('/api/send-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              topGifts: primaryGifts.map(g => g.gift.name),
              shareId: resultId,
              email: user.email,
              name: user.displayName || user.email
            })
        }).catch(console.error);

        router.push(`/results?id=${resultId}`);
        return;
      } catch (err) {
        console.error('Failed to sync results', err);
      }
      setIsSubmitting(false);
    }
    // If not authenticated, standard anonymous push
    router.push('/results');
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col min-h-[calc(100vh-80px)] relative">
      {/* Header & Progress */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md pt-4 pb-6 space-y-4">
        <div className="flex justify-between text-sm font-medium text-slate-500">
          <span>Question {Math.min(currentPage * QUESTIONS_PER_PAGE + 1, assessmentQuestions.length)} - {Math.min((currentPage + 1) * QUESTIONS_PER_PAGE, assessmentQuestions.length)} of {assessmentQuestions.length}</span>
          <span>{progressPercent}% Completed</span>
        </div>
        <ProgressBar progress={progressPercent} />
      </div>

      {/* Questions list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 space-y-6 pb-8 pt-4"
        >
          {currentQuestions.map((q) => (
            <QuestionCard 
              key={q.id} 
              question={q} 
              currentAnswer={answers[q.id]} 
              onAnswer={(val) => setAnswer(q.id, val)} 
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="pt-6 border-t border-border flex justify-between items-center pb-8 mt-auto sticky bottom-0 bg-background/95 backdrop-blur-md z-20">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="px-6 py-3 rounded-lg border border-border font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Previous
        </button>

        {currentPage < TOTAL_PAGES - 1 ? (
          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="px-8 py-3 rounded-lg bg-primary-600 text-white font-medium flex items-center gap-2 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="px-8 py-3 rounded-lg bg-gold-500 text-white font-medium flex items-center gap-2 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <CheckCircle className="w-5 h-5" /> {isSubmitting ? 'Saving...' : 'Submit Results'}
          </button>
        )}
      </div>
    </div>
  );
}
