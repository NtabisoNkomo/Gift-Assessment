'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'unread'
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-black text-gradient">Get In Touch</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Have questions about the assessment or need technical support? We're here to help.
        </p>
      </motion.div>

      <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden backdrop-blur-3xl border-white/20 dark:border-white/5 shadow-2xl">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-10 space-y-6"
            >
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black">Message Sent!</h2>
                <p className="text-slate-500 max-w-sm mx-auto text-lg leading-relaxed">
                  Thank you for reaching out. Our team will review your message and get back to you shortly.
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition" />
                    <input 
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-16 pr-8 py-5 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition" />
                    <input 
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full pl-16 pr-8 py-5 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-4">Subject</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition" />
                  <input 
                    required
                    type="text"
                    placeholder="Brief subject"
                    className="w-full pl-16 pr-8 py-5 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-4">Your Message</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="How can we help?"
                  className="w-full px-8 py-6 bg-white/50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 rounded-2xl">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <button 
                disabled={isSubmitting}
                className="w-full py-6 bg-primary-600 text-white text-xl font-black rounded-3xl hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Message <Send className="w-6 h-6" /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
