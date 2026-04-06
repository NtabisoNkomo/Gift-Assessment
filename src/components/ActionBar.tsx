'use client';

import { useState } from 'react';
import generatePDF from 'react-to-pdf';
import { Share2, Download, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionBarProps {
  shareId: string;
}

export function ActionBar({ shareId }: ActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/results?id=${shareId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    if (element) {
      generatePDF(() => element, {
        filename: 'spiritual-gifts-profile.pdf',
        page: { margin: 20 }
      });
    }
  };

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-4 z-50 max-w-sm mx-auto mb-8 backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-lg rounded-full px-6 py-3 flex gap-4 justify-between items-center transition-all"
    >
      <button 
        onClick={handleCopyLink}
        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition text-foreground"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Share Link'}
      </button>

      <div className="w-px h-6 bg-border"></div>

      <button
        onClick={handleDownloadPDF} 
        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition text-foreground"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    </motion.div>
  );
}
