'use client';

import { motion } from 'framer-motion';
import { Scale, CheckSquare, XSquare, Info } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-black text-gradient">Terms of Service</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Last updated: April 6, 2026</p>
      </motion.div>

      <div className="glass-panel p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 space-y-12">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
            <Scale className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Nature of the Service</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The Spiritual Gifts Assessment is an educational and spiritual tool. The results provided are for personal growth and community development purposes and do not constitute professional advice.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
            <CheckSquare className="w-6 h-6" />
            <h2 className="text-2xl font-bold">User Responsibilities</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Provide accurate personal information.",
              "Use the service for its intended purpose.",
              "Respect the privacy of other community members.",
              "Do not attempt to bypass any security measures."
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-slate-900">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
            <XSquare className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Limitations</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We reserve the right to modify or terminate the service for any reason, without notice at any time. We are not liable for any direct or indirect damages resulting from the use of the platform.
          </p>
        </section>

        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            These terms are subject to change. Your continued use of the service constitutes acceptance of any updates.
          </p>
        </div>
      </div>
    </div>
  );
}
