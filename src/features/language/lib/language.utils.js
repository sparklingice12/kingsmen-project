/**
 * Language Translation Utility
 * 
 * Pure translation function - no dependencies, fully portable.
 * Can be used in any context (components, services, stores).
 */

/**
 * Creates a translation function
 * @param {Object} translations - Translation data object
 * @param {string} currentLang - Current language code
 * @param {string} fallbackLang - Fallback language code
 * @returns {Function} Translation function
 */
export function createTranslator(translations, currentLang, fallbackLang = 'en') {
  return (path) => {
    const keys = path.split('.');
    let current = translations;

    // Navigate through the path
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path}`);
        return path;
      }
      current = current[key];
    }

    // Return translation in current language, fallback, or the path itself
    return current[currentLang] || current[fallbackLang] || path;
  };
}

/**
 * Get a translated value from a multi-language object
 * @param {Object} multiLangObject - Object with language keys (e.g., { en: "Hello", ru: "Привет" })
 * @param {string} currentLang - Current language code
 * @param {string} fallbackLang - Fallback language code
 * @returns {string} Translated value
 */
export function getTranslation(multiLangObject, currentLang, fallbackLang = 'en') {
  if (!multiLangObject) return '';
  return multiLangObject[currentLang] || multiLangObject[fallbackLang] || Object.values(multiLangObject)[0] || '';
}
