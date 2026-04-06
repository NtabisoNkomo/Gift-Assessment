import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'admin123';

  if (username === adminUser && password === adminPass) {
    const response = NextResponse.json({ success: true });
    
    // Set a secure, HTTP-only cookie for admin sessions
    response.cookies.set('admin-session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
