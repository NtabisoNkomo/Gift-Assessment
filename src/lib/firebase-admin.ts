import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must handle escaped newlines
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    // Fallback for local development if credentials aren't provided
    // but environment is already authenticated via gcloud CLI
    if (process.env.NODE_ENV !== 'production') {
       admin.initializeApp({
         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
       });
    } else {
       console.error('Firebase Admin initialization error:', error);
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
