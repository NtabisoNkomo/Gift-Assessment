import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
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

    // 3. Perform deletion
    // Since this is running server-side in a Next.js API route,
    // it will execute with the server's context. 
    // In a production environment, you should ideally use firebase-admin
    // but here we are using the client SDK initialized on the server.
    await deleteDoc(doc(db, collectionName, id));

    return NextResponse.json({ success: true, message: `Document deleted from ${collectionName}` });
  } catch (err: unknown) {
    console.error('Error in delete API:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
