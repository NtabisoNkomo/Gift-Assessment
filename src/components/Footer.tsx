'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Globe, MessageCircle, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 px-6 mt-20 border-t border-border/40 bg-background/30 backdrop-blur-md relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform bg-white/10 relative">
               <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill
                  className="object-cover" 
               />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-gold-500 tracking-tight">
              Spiritual Gifts
            </span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            Helping individuals discover their God-given strengths to serve their communities and grow in their spiritual journey.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="mailto:contact@spiritualgifts.com" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-foreground uppercase tracking-widest text-sm">Platform</h3>
          <ul className="space-y-4">
            <li><Link href="/assessment" className="text-slate-500 hover:text-primary-500 transition-colors">Assessment</Link></li>
            <li><Link href="/dashboard" className="text-slate-500 hover:text-primary-500 transition-colors">Personal Results</Link></li>
            <li><Link href="/login" className="text-slate-500 hover:text-primary-500 transition-colors">Sign In</Link></li>
            <li><Link href="/register" className="text-slate-500 hover:text-primary-500 transition-colors">Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-foreground uppercase tracking-widest text-sm">Support</h3>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-slate-500 hover:text-primary-500 transition-colors">About Us</Link></li>
            <li><Link href="/privacy" className="text-slate-500 hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-slate-500 hover:text-primary-500 transition-colors">Terms of Service</Link></li>
            <li><Link href="/contact" className="text-slate-500 hover:text-primary-500 transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-border/20 text-center text-slate-500 text-sm">
        <p className="flex items-center justify-center gap-1">
          © {currentYear} Spiritual Gifts Assessment. Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> for the community.
        </p>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[120px] rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 blur-[120px] rounded-full -ml-32 -mb-32" />
    </footer>
  );
}
