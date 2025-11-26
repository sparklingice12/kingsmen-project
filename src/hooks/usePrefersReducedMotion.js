import { useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // setPrefers(mq.matches); // Initial value set in useState
    
    const onChange = () => setPrefers(mq.matches);
    mq.addEventListener('change', onChange);
    
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return prefers;
}
