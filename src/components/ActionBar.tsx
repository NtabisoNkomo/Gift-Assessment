'use client';

import generatePDF from 'react-to-pdf';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionBarProps {
  shareId: string;
}

export function ActionBar({ shareId }: ActionBarProps) {
  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    if (element) {
      try {
        generatePDF(() => element, {
          filename: 'spiritual-gifts-profile.pdf',
          page: { margin: 20 }
        });
      } catch (err) {
        console.error('PDF generation failed:', err);
        alert('PDF generation failed. If you are on mobile, please try using a desktop browser or print the page.');
      }
    }
  };

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-4 z-50 max-w-[200px] mx-auto mb-8 backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-6 py-3 flex justify-center items-center transition-all"
    >

      <button
        onClick={handleDownloadPDF} 
        className="flex items-center gap-2 text-sm font-bold hover:text-primary-600 transition text-foreground"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    </motion.div>
  );
}
