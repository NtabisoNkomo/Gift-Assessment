/**
 * Utility to determining the base API URL based on the environment (Web vs APK).
 */
export function getBaseUrl(): string {
  // If in Capacitor (APK), we must use the absolute domain for API calls
  if (typeof window !== 'undefined' && (window as { Capacitor?: unknown }).Capacitor) {
    return 'https://spiritual-gifts-assessment.vercel.app';
  }
  
  // If in standard browser, relative URLs work fine
  return '';
}

/**
 * Enhanced fetch wrapper for cross-platform API communication.
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
