// Utility function to clear NextAuth cookies
export function clearNextAuthCookies() {
  if (typeof window !== 'undefined') {
    // Clear NextAuth cookies
    const cookies = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      'next-auth.state',
      '__Secure-next-auth.session-token'
    ];
    
    cookies.forEach(cookieName => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
    });
    
    // Clear localStorage
    localStorage.clear();
    sessionStorage.clear();
  }
}
