"use client";

import { useEffect } from 'react';

// Clear NextAuth related cookies
function clearNextAuthCookies() {
  // Common NextAuth cookie names
  const cookieNames = [
    'next-auth.session-token',
    'next-auth.csrf-token',
    'next-auth.callback-url',
    'next-auth.state',
    '__Secure-next-auth.session-token',
    '__Host-next-auth.csrf-token',
    '__Secure-next-auth.callback-url',
  ];

  cookieNames.forEach(name => {
    // Clear cookie for current domain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Clear cookie for current domain with secure flag
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`;
    // Clear cookie for subdomain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  });
}

export function ClearCorruptedSession() {
  useEffect(() => {
    // Clear corrupted cookies on client side
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clearSession') === 'true') {
      clearNextAuthCookies();
      // Remove the parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return null;
}
