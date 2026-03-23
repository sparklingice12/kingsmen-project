/**
 * Language Feature - Barrel Exports
 * 
 * Central export point for all language-related modules.
 * Use this for clean imports: import { useLanguage, LanguageSwitcherButton } from '@/features/language'
 */

// Components
export { LanguageSwitcherButton } from './components/LanguageSwitcherButton';
export { LanguageSwitcherButtonSecondary } from './components/LanguageSwitcherButtonSecondary';
export { LanguageSwitcherScreen } from './components/LanguageSwitcherScreen';

// Hooks
export { useLanguage } from './hooks/useLanguage';

// Services
export { languageService } from './lib/language.service';

// Utilities
export { createTranslator, getTranslation } from './lib/language.utils';

// Config
export { languageConfig } from './language.config';
