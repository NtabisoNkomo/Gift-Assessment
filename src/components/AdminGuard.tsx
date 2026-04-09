'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAdminToken } from '@/lib/admin-auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // In Standalone APK / Static Export, we check localStorage or cookies
        let token = '';
        if (typeof window !== 'undefined') {
          // Check cookies first (standard Next.js)
          const match = document.cookie.match(new RegExp('(^| )admin-session=([^;]+)'));
          if (match) {
            token = match[2];
          } else {
            // Check localStorage (fallback for APK standalone mode)
            token = localStorage.getItem('admin-session') || '';
          }
        }

        if (!token) {
          setAuthorized(false);
          router.push('/admin/login');
          return;
        }

        const payload = await verifyAdminToken(token);
        if (payload) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Admin authentication guard error:', error);
        setAuthorized(false);
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium tracking-wide">Validating Security Session...</p>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
