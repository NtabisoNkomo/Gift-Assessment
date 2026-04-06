import { Timestamp } from 'firebase/firestore';

/**
 * Represents a spiritual gifts assessment result document stored in Firestore.
 */
export interface FirestoreResult {
  userId: string;
  userName: string;
  userEmail: string | null;
  /** JSON-stringified Record<number, number> — question ID → answer value */
  answers: string;
  /** JSON-stringified string[] — top gift names */
  topGifts: string;
  createdAt: Timestamp | null;
}
