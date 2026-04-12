/**
 * Animal System Service
 * Business logic for chicken feeding, egg production, and state management
 */

import { ANIMALS_CONFIG } from './animals.config';

export const animalsService = {
    /**
     * Feed a chicken
     * @param {Object} chicken - Chicken state object
     * @returns {Object} Updated chicken state
     */
    feedChicken(chicken) {
        return {
            ...chicken,
            fed: true,
            lastFedDay: chicken.currentDay,
        };
    },

    /**
     * Check if chicken should produce an egg
     * @param {Object} chicken - Chicken state object
     * @param {number} currentDay - Current game day
     * @returns {boolean} True if chicken produces egg
     */
    shouldProduceEgg(chicken, currentDay) {
        // Chicken produces egg if it was fed on the previous day
        return chicken.fed && chicken.lastFedDay === currentDay - 1;
    },

    /**
     * Advance chicken to next day
     * @param {Object} chicken - Chicken state object
     * @param {number} currentDay - Current game day
     * @returns {Object} Updated chicken state with egg production flag
     */
    advanceDay(chicken, currentDay) {
        const producesEgg = this.shouldProduceEgg(chicken, currentDay);

        return {
            ...chicken,
            fed: false, // Reset fed status for new day
            currentDay,
            producedEgg: producesEgg,
        };
    },

    /**
     * Get egg value in coins
     * @returns {number} Coin value of one egg
     */
    getEggValue() {
        return ANIMALS_CONFIG.chicken.eggValue;
    },

    /**
     * Get educational content for chickens
     * @returns {Object} Educational content
     */
    getEducationalContent() {
        return ANIMALS_CONFIG.chicken.educationalContent;
    },

    /**
     * Initialize chicken state
     * @param {number} id - Chicken ID
     * @param {Object} position - Grid position {x, y}
     * @returns {Object} Initial chicken state
     */
    createChicken(id, position) {
        return {
            id,
            position,
            fed: false,
            lastFedDay: 0,
            currentDay: 1,
            producedEgg: false,
        };
    },
};
