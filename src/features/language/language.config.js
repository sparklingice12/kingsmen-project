/**
 * Language Feature Configuration
 * 
 * Central configuration for language management.
 * Edit this file to customize language behavior.
 */

export const languageConfig = {
  // Default language to use on first load
  defaultLanguage: 'en',
  
  // LocalStorage key for persistence
  storageKey: 'space-garden-language',
  
  // Fallback language when translation is missing
  fallbackLanguage: 'en',
  
  // Path to content data (for internal use)
  contentPath: '@/data/content.json',
};
