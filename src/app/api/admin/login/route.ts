import { NextResponse } from 'next/server';
import { getClientIp, signAdminToken } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const ip = await getClientIp();
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'admin123';

  const isSuccess = username === adminUser && password === adminPass;

  // Log activity to Firestore
  try {
    await adminDb.collection('admin_logs').add({
      username: username || 'unknown',
      ip,
      userAgent,
      status: isSuccess ? 'success' : 'failure',
      timestamp: new Date().toISOString(),
      action: 'login_attempt'
    });
  } catch (error) {
    console.error('Failed to log admin login activity:', error);
  }

  if (isSuccess) {
    // Sign a JWT with IP address embedded
    const token = await signAdminToken({
      username,
      ip,
      role: 'admin'
    });

    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful' 
    });
    
    // Set a secure, HTTP-only cookie with the JWT
    response.cookies.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  }

  return NextResponse.json({ 
    success: false, 
    error: 'Invalid credentials' 
  }, { status: 401 });
}
