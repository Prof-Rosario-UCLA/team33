'use client';

import { useState, useEffect } from 'react';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Initial check
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-white p-4 text-center">
      <p>You are currently offline. Trying to fetch data...</p>
    </div>
  );
};

export default OfflineBanner; 