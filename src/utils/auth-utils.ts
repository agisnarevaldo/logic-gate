/**
 * Utility functions for handling authentication errors and cookie management
 */

export function clearNextAuthCookies() {
  if (typeof window !== 'undefined') {
    // Clear all NextAuth cookies
    const cookies = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Secure-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.state'
    ];

    cookies.forEach(cookieName => {
      // Clear for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      
      // Clear for parent domain (if subdomain)
      const domain = window.location.hostname;
      const parentDomain = domain.split('.').slice(-2).join('.');
      if (domain !== parentDomain) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${parentDomain};`;
      }
    });

    // Clear localStorage items that might be related
    try {
      localStorage.removeItem('next-auth.message');
      sessionStorage.clear();
    } catch (e) {
      console.log('Could not clear storage:', e);
    }
  }
}

export function handleAuthError(error: Error | { message?: string } | unknown) {
  console.log('Auth error detected:', (error as Error)?.message || error);
  
  if (typeof window !== 'undefined') {
    // Check if it's a JWT session error
    const errorMessage = (error as Error)?.message || '';
    if (errorMessage.includes('JWT') || errorMessage.includes('decryption')) {
      console.log('JWT session error detected, clearing corrupted cookies...');
      clearNextAuthCookies();
      
      // Redirect to clear session
      window.location.href = '/?clearSession=true';
      return true;
    }
  }
  
  return false;
}
