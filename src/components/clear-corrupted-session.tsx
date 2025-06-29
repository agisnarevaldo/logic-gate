"use client";

import { useEffect } from 'react';
import { clearNextAuthCookies } from '@/utils/auth-utils';

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
