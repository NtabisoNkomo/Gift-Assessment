'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-black text-gradient">Privacy Policy</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Last updated: April 6, 2026</p>
      </motion.div>

      <div className="glass-panel p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 space-y-12">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
            <Eye className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Information We Collect</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We collect information you provide directly to us, such as when you create an account, take the assessment, or contact us. This may include your name, email address, and assessment responses.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
            <Globe className="w-6 h-6" />
            <h2 className="text-2xl font-bold">How We Use Your Data</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Your assessment results are used to provide personal insights and, if you are part of a congregation, to help your leadership understand the collective gifts of the community. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
            <Lock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Data Security</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30 flex items-start gap-4">
          <Shield className="w-6 h-6 text-primary-600 mt-1 shrink-0" />
          <p className="text-sm text-primary-800 dark:text-primary-200">
            By using this assessment, you agree to our collection and use of information in accordance with this policy.
          </p>
        </div>
      </div>
    </div>
  );
}
