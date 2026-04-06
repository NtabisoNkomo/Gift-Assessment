import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Fallback for build time or local dev where full credentials may not be present
      if (process.env.NODE_ENV !== 'production' || !projectId) {
        admin.initializeApp({
          projectId: projectId || 'fallback-project-id',
        });
      } else {
        // In production build, if variables are missing, we still try an empty init to avoid blocking build
        // but warn clearly in the logs.
        console.warn('Firebase Admin credentials missing. Deferring initialization.');
        admin.initializeApp({ projectId });
      }
    }
  } catch (error) {
    console.error('Firebase Admin final initialization error:', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
