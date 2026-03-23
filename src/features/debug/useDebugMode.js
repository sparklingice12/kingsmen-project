import { useEffect, useState } from 'react';

function getDebugModeFromUrl() {
  if (typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).get('debug') === 'true';
}

export function useDebugMode() {
  const [isDebugMode, setIsDebugMode] = useState(getDebugModeFromUrl);

  useEffect(() => {
    const syncDebugMode = () => {
      setIsDebugMode(getDebugModeFromUrl());
    };

    syncDebugMode();
    window.addEventListener('popstate', syncDebugMode);

    return () => {
      window.removeEventListener('popstate', syncDebugMode);
    };
  }, []);

  return isDebugMode;
}
