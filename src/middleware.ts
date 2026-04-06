import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protects /admin routes at the server/edge level.
 * Since Firebase auth is client-side, we use a lightweight
 * session cookie (`auth-session`) set on login/register.
 * The actual role check (UID whitelist) is enforced client-side in the admin page.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin protection
  if (pathname.startsWith('/admin')) {
    // Exclude the login page itself from the check
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const adminSession = request.cookies.get('admin-session');

    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Dashboard & Assessment (User Auth)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/assessment')) {
    const authSession = request.cookies.get('auth-session');

    if (!authSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/assessment/:path*'],
};
