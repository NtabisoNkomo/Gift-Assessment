import { GiftScore } from '@/lib/scoring';
import { BookOpen, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function GiftCard({ giftScore, rank }: { giftScore: GiftScore; rank: number }) {
  const { gift, percentage } = giftScore;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: rank * 0.1, ease: "easeOut" }}
      className="glass-panel-heavy rounded-[2.5rem] p-8 hover:shadow-2xl transition-all relative overflow-hidden group hover:-translate-y-2 border border-white/20 dark:border-white/5 active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-gold-500/5 group-hover:opacity-100 opacity-0 transition-opacity pointer-events-none" />
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Star className="w-40 h-40 text-primary-500 transform translate-x-12 -translate-y-12 rotate-12 group-hover:scale-125 transition-transform duration-1000" />
      </div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-gold-500/20">
            <Star className="w-3 h-3 fill-gold-500" /> Rank #{rank}
          </div>
          <h3 className="text-3xl font-black text-foreground tracking-tight leading-tight">{gift.name}</h3>
        </div>
        <div className="text-right bg-white dark:bg-white/5 p-3 rounded-2xl shadow-sm border border-border/50">
          <span className="text-3xl font-black text-gradient">{percentage}%</span>
        </div>
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 mb-8 min-h-[72px] relative z-10 leading-relaxed font-medium italic">
        "{gift.description}"
      </p>

      <div className="space-y-5 pt-6 border-t border-border/40 relative z-10">
        <div className="flex gap-3 items-start">
          <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Key Scriptures</span>
            <div className="text-sm font-bold text-foreground/80">{gift.scriptures.join(', ')}</div>
          </div>
        </div>
        
        <div className="flex gap-3 items-start">
          <div className="p-2 rounded-xl bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Impact Areas</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {gift.ministries.map(m => (
                <span key={m} className="bg-white/80 dark:bg-white/5 border border-border/60 text-foreground/70 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm hover:border-primary-500/30 transition-colors">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
