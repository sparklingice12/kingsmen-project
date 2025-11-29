/**
 * Language Service
 * 
 * Handles loading and managing language data from content.json
 */

import content from '@/data/content.json';
import { languageConfig } from '../language.config';

/**
 * Language Service Class
 */
class LanguageService {
  constructor() {
    this.content = content;
  }

  /**
   * Get available languages
   * @returns {Array} Array of language objects { code, label }
   */
  getAvailableLanguages() {
    return this.content.languages || [];
  }

  /**
   * Get all UI translations
   * @returns {Object} UI translation object
   */
  getTranslations() {
    return this.content.ui || {};
  }

  /**
   * Get data items
   * @returns {Array} Array of data items
   */
  getDataItems() {
    return this.content.data?.items || [];
  }

  /**
   * Get a specific data item by ID
   * @param {string} id - Item ID
   * @returns {Object|null} Item or null
   */
  getDataById(id) {
    return this.getDataItems().find(item => item.id === id) || null;
  }

  /**
   * Validate if a language code is available
   * @param {string} langCode - Language code to validate
   * @returns {boolean} True if language is available
   */
  isLanguageAvailable(langCode) {
    return this.getAvailableLanguages().some(lang => lang.code === langCode);
  }

  /**
   * Get default language from config
   * @returns {string} Default language code
   */
  getDefaultLanguage() {
    return languageConfig.defaultLanguage;
  }
}

// Singleton instance
export const languageService = new LanguageService();
