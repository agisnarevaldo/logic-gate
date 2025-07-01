"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { clearNextAuthCookies, handleAuthError } from '@/utils/auth-utils';
import { Button } from '@/components/ui/button';

export function SessionErrorHandler() {
  const { status } = useSession();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Listen for session errors
    const handleError = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && (
        customEvent.detail.message?.includes('JWT') || 
        customEvent.detail.message?.includes('decryption')
      )) {
        setShowError(true);
        handleAuthError(customEvent.detail);
      }
    };

    // Check for session loading errors
    if (status === 'loading') {
      const timeout = setTimeout(() => {
        if (status === 'loading') {
          console.log('Session taking too long to load, might be corrupted');
          setShowError(true);
        }
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeout);
    }

    window.addEventListener('next-auth-error', handleError);
    return () => window.removeEventListener('next-auth-error', handleError);
  }, [status]);

  const handleClearSession = () => {
    clearNextAuthCookies();
    window.location.reload();
  };

  if (!showError) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Session Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              Your session appears to be corrupted. This can happen when the application is updated or when cookies become invalid.
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <Button
                onClick={handleClearSession}
                variant="outline"
                size="sm"
                className="bg-red-50 text-red-800 hover:bg-red-100 border-red-300"
              >
                Clear Session & Reload
              </Button>
              <Button
                onClick={() => setShowError(false)}
                variant="ghost"
                size="sm"
                className="ml-2 text-red-800 hover:bg-red-100"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
