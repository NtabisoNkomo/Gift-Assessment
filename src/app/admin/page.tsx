'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FirestoreResult } from '@/lib/types';
import { Trash2, Mail as MailIcon, MessageSquare } from 'lucide-react';
import ContactModal from '@/components/ContactModal';


interface ResultDoc extends FirestoreResult {
  id: string;
}

interface MessageDoc {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt?: { toDate: () => Date };
}

export default function AdminDashboard() {
  const [results, setResults] = useState<ResultDoc[]>([]);
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ email: '', name: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch results
        const qResults = query(collection(db, 'results'), orderBy('createdAt', 'desc'));
        const querySnapshotResults = await getDocs(qResults);
        const docsResults = querySnapshotResults.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as FirestoreResult),
        }));
        setResults(docsResults);

        // Fetch messages
        const qMessages = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
        const querySnapshotMessages = await getDocs(qMessages);
        const docsMessages = querySnapshotMessages.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<MessageDoc, 'id'>),
        }));
        setMessages(docsMessages);
      } catch (e) {
        console.error('Failed to fetch admin data.', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, collectionName: 'contact_messages' }),
      });

      if (!res.ok) throw new Error('Failed to delete message');
      setMessages(messages.filter((m) => m.id !== id));
    } catch (e) {
      console.error('Failed to delete message:', e);
      alert('Error deleting message. Please try again.');
    }
  };

  const deleteResult = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment result? This will NOT delete the user profile.')) return;
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, collectionName: 'results' }),
      });

      if (!res.ok) throw new Error('Failed to delete result');
      setResults(results.filter((r) => r.id !== id));
    } catch (e) {
      console.error('Failed to delete result:', e);
      alert('Error deleting assessment. Please try again.');
    }
  };

  const openContactModal = (email: string, name: string) => {
    setSelectedUser({ email, name });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">Initializing Admin Panel…</p>
        </div>
      </div>
    );
  }

  // Aggregate gift counts
  const giftCounts: Record<string, number> = {};
  results.forEach((r) => {
    if (r.topGifts) {
      try {
          const topGifts = JSON.parse(r.topGifts) as string[];
          topGifts.forEach((g) => {
            giftCounts[g] = (giftCounts[g] || 0) + 1;
          });
      } catch (e) {
          console.error("Error parsing topGifts", e);
      }
    }
  });

  const sortedGifts = Object.entries(giftCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-12 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gradient">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Managing {results.length} assessments and {messages.length} inquiries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Summary Panel */}
        <div className="lg:col-span-2 space-y-8">
            <section className="glass-card">
              <h2 className="text-2xl font-black mb-1">Gift Distribution</h2>
              <p className="text-sm text-slate-500 mb-8 font-medium">Most prevalent spiritual gifts across your community.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {sortedGifts.length === 0 && <p className="text-sm text-slate-400">No assessment data available yet.</p>}
                {sortedGifts.map(([gift, count], index) => (
                  <div
                    key={gift}
                    className="flex items-center justify-between p-5 rounded-2xl bg-white/50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-black group-hover:scale-110 transition-transform">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{gift}</span>
                    </div>
                    <span className="font-black text-2xl text-primary-600 dark:text-primary-400">{count}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Assessment History */}
            <section className="glass-card">
              <h2 className="text-2xl font-black mb-6">Recent Assessments</h2>
              <div className="space-y-4">
                {results.length === 0 && <p className="text-sm text-slate-400">No submissions yet.</p>}
                {results.slice(0, 20).map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/60 dark:hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-black text-xl">
                            {(r.userName || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{r.userName || 'Unnamed User'}</h3>
                            <p className="text-sm text-slate-500 font-medium">{r.userEmail}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={() => openContactModal(r.userEmail || '', r.userName || 'User')}
                            className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition group/btn"
                            title="Contact User"
                        >
                            <MailIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <Link
                            href={`/results/${r.id}`}
                            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            Review
                        </Link>
                        <button
                            onClick={() => deleteResult(r.id)}
                            className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition group/btn"
                            title="Delete Assessment"
                        >
                            <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
        </div>

        {/* Messages Sidebar Panel */}
        <div className="space-y-8">
            <section className="glass-card h-full flex flex-col border-primary-500/20">
              <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-black">Messages</h2>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full text-xs font-black uppercase tracking-widest">{messages.length}</span>
              </div>
              <p className="text-sm text-slate-500 mb-8 font-medium">Inquiries from the contact form.</p>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-slate-400 text-sm italic">No messages received yet.</p>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-black/20 space-y-3 relative group"
                  >
                    <div className="absolute top-4 right-4 flex gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                        <button 
                            onClick={() => openContactModal(m.email, m.name)}
                            className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 transition"
                            title="Reply to Message"
                        >
                            <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => deleteMessage(m.id)}
                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100 transition"
                            title="Delete Message"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-black text-primary-500 uppercase tracking-widest">{m.subject || 'No Subject'}</p>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{m.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{m.email}</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        &quot;{m.message}&quot;
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                        {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
        </div>
      </div>

      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipientEmail={selectedUser.email}
        recipientName={selectedUser.name}
      />
    </div>
  );
}
