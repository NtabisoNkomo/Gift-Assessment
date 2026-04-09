import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'spiritual-gifts-default-secret-change-me';
const secret = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'admin-session';

export interface AdminPayload {
  username: string;
  ip: string;
  role: 'admin';
}

/**
 * Gets the client's public IP address from request headers (Server) 
 * or external API (Client/APK).
 */
export async function getClientIp(): Promise<string> {
  // If in browser (Client/APK)
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '0.0.0.0';
    } catch (error) {
      console.error('Failed to fetch public IP from client:', error);
      return '127.0.0.1';
    }
  }

  // If on Server (Next.js SSR/API) - Fallback
  try {
    const { headers } = await import('next/headers');
    const forwarded = headers().get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    return headers().get('x-real-ip') || '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
}

/**
 * Signs a JWT with the admin payload and IP.
 */
export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

/**
 * Verifies the admin token and validates the IP.
 */
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const data = payload as unknown as AdminPayload;

    // Validate current IP against stored IP
    const currentIp = await getClientIp();
    if (data.ip !== currentIp) {
      console.warn(`[Security Alert] IP mismatch for admin session: stored=${data.ip}, current=${currentIp}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Helper to check if the current request is an authenticated admin.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  let token = '';
  
  if (typeof window !== 'undefined') {
    // Client-side: Check matching cookie or localStorage
    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    token = match ? match[2] : (localStorage.getItem(COOKIE_NAME) || '');
  } else {
    // Server-side: Check next/headers
    try {
      const { cookies } = await import('next/headers');
      token = cookies().get(COOKIE_NAME)?.value || '';
    } catch {
      token = '';
    }
  }

  if (!token) return false;

  const payload = await verifyAdminToken(token);
  return !!payload;
}

/**
 * Helper to get admin session data.
 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  let token = '';

  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    token = match ? match[2] : (localStorage.getItem(COOKIE_NAME) || '');
  } else {
    try {
      const { cookies } = await import('next/headers');
      token = cookies().get(COOKIE_NAME)?.value || '';
    } catch {
      token = '';
    }
  }

  if (!token) return null;

  return await verifyAdminToken(token);
}
