import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spiritual Gifts Assessment | Identify Your Purpose',
  description: 'The Spiritual Gifts Assessment identifies the unique areas where you are best equipped to serve and grow in your spiritual journey.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased relative overflow-x-hidden transition-colors duration-500`}>
        {/* Animated Background Flow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] opacity-60 print:hidden">
          <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary-500/10 dark:bg-primary-500/5 mix-blend-multiply dark:mix-blend-overlay filter blur-[120px] animate-blob" />
          <div className="absolute top-[10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-gold-400/10 dark:bg-gold-500/5 mix-blend-multiply dark:mix-blend-overlay filter blur-[120px] animate-blob-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[-15%] left-[15%] w-[65vw] h-[65vw] rounded-full bg-primary-700/10 dark:bg-primary-800/5 mix-blend-multiply dark:mix-blend-overlay filter blur-[140px] animate-blob" style={{ animationDelay: '4s' }} />
          <div className="absolute top-[40%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-primary-400/5 dark:bg-gold-600/5 mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob-slow" style={{ animationDelay: '6s' }} />
        </div>
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1 flex flex-col relative z-10">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

