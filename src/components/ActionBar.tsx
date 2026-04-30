'use client';

import { Printer } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionBarProps {
  shareId: string;
}

export function ActionBar({ }: ActionBarProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-4 z-50 max-w-[200px] mx-auto mb-8 backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-6 py-3 flex justify-center items-center transition-all print:hidden"
    >
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 text-sm font-bold hover:text-primary-600 transition text-foreground"
      >
        <Printer className="w-4 h-4" />
        Download PDF
      </button>
    </motion.div>
  );
}
