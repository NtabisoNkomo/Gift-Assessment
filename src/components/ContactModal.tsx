'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
}

export default function ContactModal({ isOpen, onClose, recipientEmail, recipientName }: ContactModalProps) {
  const [subject, setSubject] = useState(`Message from Admin - Spiritual Gifts Assessment`);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const res = await apiFetch('/api/admin/contact-user', {
        method: 'POST',
        body: JSON.stringify({
          email: recipientEmail,
          name: recipientName,
          subject,
          message,
        }),
      });

      if (!res.ok) throw new Error('Failed to send email');
      
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to send message. Please check and try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-panel-heavy w-full max-w-xl rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl border-white/20 dark:border-white/10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {sent ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Email Sent!</h2>
                  <p className="text-slate-500">Message sent to {recipientName}.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black">Contact User</h2>
                  <p className="text-sm text-slate-500">Sending email to <span className="text-primary-500 font-bold">{recipientEmail}</span></p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-6 py-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-white/50 dark:bg-black/20 rounded-3xl border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition resize-none"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <button 
                  disabled={isSending}
                  className="w-full py-5 bg-primary-600 text-white font-black rounded-3xl flex items-center justify-center gap-3 hover:bg-primary-700 transition-all disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send Message <Send className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
