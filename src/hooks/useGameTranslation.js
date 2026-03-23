import { useStore } from '@/state/store';

/**
 * Custom hook for accessing game-specific translations
 * @returns {Object} Translation functions and current language
 */
export function useGameTranslation() {
  const currentLang = useStore((s) => s.language.currentLang);
  const t = useStore((s) => s.language.t);

  /**
   * Get translation for a game UI path
   * @param {string} path - Dot notation path (e.g., 'tutorial.title')
   * @returns {string} Translated text
   */
  const tGame = (path) => t(`game.${path}`);

  /**
   * Get translation for common UI elements
   * @param {string} path - Dot notation path (e.g., 'close', 'back')
   * @returns {string} Translated text
   */
  const tCommon = (path) => t(`common.${path}`);

  /**
   * Get wave title translation
   * @param {string} waveId - Wave ID (vegetables, carbohydrates, protein, fruit, dressing)
   * @returns {string} Translated wave title
   */
  const tWave = (waveId) => t(`game.waves.${waveId}`);

  /**
   * Get ingredient name translation
   * @param {string} ingredientId - Ingredient ID
   * @returns {string} Translated ingredient name
   */
  const tIngredient = (ingredientId) => t(`game.ingredients.${ingredientId}.name`);

  /**
   * Get ingredient reason translation
   * @param {string} ingredientId - Ingredient ID
   * @returns {string} Translated ingredient reason
   */
  const tIngredientReason = (ingredientId) => t(`game.ingredients.${ingredientId}.reason`);

  /**
   * Get advice translation for a wave category
   * @param {string} category - Category (vegetables, carbohydrates, protein, fruit, dressing)
   * @returns {string} Translated advice
   */
  const tAdvice = (category) => t(`game.advice.${category}`);

  return {
    currentLang,
    t,
    tGame,
    tCommon,
    tWave,
    tIngredient,
    tIngredientReason,
    tAdvice
  };
}
