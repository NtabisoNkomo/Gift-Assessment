'use client';

import { Question } from '@/data/questions';
import { motion } from 'framer-motion';

export function QuestionCard({ 
  question, 
  currentAnswer, 
  onAnswer 
}: { 
  question: Question; 
  currentAnswer?: number; 
  onAnswer: (value: number) => void;
}) {
  const options = [
    { value: 3, label: "Very Much" },
    { value: 2, label: "Sometimes" },
    { value: 1, label: "A Little" },
    { value: 0, label: "Not at all" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass-panel p-8 rounded-[2rem] border transition-all duration-500 space-y-8 ${
        currentAnswer !== undefined ? 'border-primary-500/40 shadow-2xl shadow-primary-500/5' : 'border-border/60'
      }`}
    >
      <div className="flex items-start gap-5">
        <span className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center text-lg font-black shrink-0 shadow-sm border border-primary-200/50 dark:border-primary-800/50">
          {question.id}
        </span>
        <h3 className="text-2xl text-foreground font-bold tracking-tight leading-tight pt-1">{question.text}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {options.map(opt => {
          const isSelected = currentAnswer === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              className={`py-4 px-6 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${
                isSelected 
                  ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-600/30 scale-[1.05]'
                  : 'bg-white/50 dark:bg-black/30 border-transparent text-slate-500 dark:text-slate-400 hover:border-primary-500/30 hover:bg-white dark:hover:bg-white/10 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </motion.div>

  );
}
