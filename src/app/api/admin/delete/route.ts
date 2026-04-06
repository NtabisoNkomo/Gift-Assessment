import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. Verify admin session
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin-session');

    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const { id, collectionName } = await req.json();

    if (!id || !collectionName) {
      return NextResponse.json({ error: 'Missing ID or collection name' }, { status: 400 });
    }

    // 3. Perform deletion using Admin SDK
    // This bypasses security rules and ensures consistent deletion
    await adminDb.collection(collectionName).doc(id).delete();

    return NextResponse.json({ 
      success: true, 
      message: `Document deleted from ${collectionName}` 
    });
  } catch (err: unknown) {
    console.error('Error in delete API:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
