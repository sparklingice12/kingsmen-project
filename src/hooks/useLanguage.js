/**
 * useLanguage Hook
 * 
 * Custom hook that wraps Zustand language state.
 * Provides a clean, consistent API for language management.
 */

import { useStore } from '@/state/store';

/**
 * Hook to access language state and actions
 * @returns {Object} Language state and methods
 */
export function useLanguage() {
  const languageState = useStore((state) => state.language);
  
  return {
    // Current language code
    currentLang: languageState.currentLang,
    
    // Available languages array
    availableLanguages: languageState.availableLanguages,
    
    // Translation function
    t: languageState.t,
    
    // Set language action
    setLanguage: languageState.setLanguage,
  };
}
