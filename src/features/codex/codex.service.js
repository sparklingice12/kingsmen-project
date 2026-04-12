/**
 * Heritage Codex Service
 * 
 * Handles unlock logic for encyclopedia entries based on game state.
 * 
 * Requirements: 2.5.3, 2.5.4
 */

import { CODEX_ENTRIES, CODEX_CONFIG } from './codex.config';

/**
 * Check if an entry is unlocked based on game state
 * 
 * @param {Object} entry - Codex entry
 * @param {Object} gameState - Current game state from Zustand store
 * @returns {boolean} - Whether the entry is unlocked
 */
export function isEntryUnlocked(entry, gameState) {
    const { unlockCondition, unlockValue } = entry;

    switch (unlockCondition) {
        case CODEX_CONFIG.UNLOCK_CONDITIONS.ALWAYS:
            return true;

        case CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_CROP: {
            // Check if the specific crop has been planted
            const tiles = gameState.farm?.tiles || [];
            return tiles.some(tile => tile.crop === unlockValue);
        }

        case CODEX_CONFIG.UNLOCK_CONDITIONS.HARVEST_CROP: {
            // Check if any crop has been harvested (or specific crop if unlockValue is not 'any')
            const harvested = gameState.inventory?.harvested || {};
            if (unlockValue === 'any') {
                return Object.values(harvested).some(count => count > 0);
            }
            return (harvested[unlockValue] || 0) > 0;
        }

        case CODEX_CONFIG.UNLOCK_CONDITIONS.REACH_DAY: {
            // Check if player has reached the specified day
            const currentDay = gameState.game?.currentDay || 1;
            return currentDay >= unlockValue;
        }

        case CODEX_CONFIG.UNLOCK_CONDITIONS.EARN_COINS: {
            // Check if player has earned the specified amount of coins
            const coins = gameState.inventory?.coins || 0;
            return coins >= unlockValue;
        }

        case CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_DIVERSITY: {
            // Check if player has planted the specified number of different crop types
            const tiles = gameState.farm?.tiles || [];
            const uniqueCrops = new Set(
                tiles
                    .filter(tile => tile.crop)
                    .map(tile => tile.crop)
            );
            return uniqueCrops.size >= unlockValue;
        }

        default:
            return false;
    }
}

/**
 * Get all unlocked entries
 * 
 * @param {Object} gameState - Current game state from Zustand store
 * @returns {Array} - Array of unlocked entries
 */
export function getUnlockedEntries(gameState) {
    return CODEX_ENTRIES.filter(entry => isEntryUnlocked(entry, gameState));
}

/**
 * Get unlocked entries by category
 * 
 * @param {string} category - Category to filter by
 * @param {Object} gameState - Current game state from Zustand store
 * @returns {Array} - Array of unlocked entries in the category
 */
export function getUnlockedEntriesByCategory(category, gameState) {
    return CODEX_ENTRIES
        .filter(entry => entry.category === category)
        .filter(entry => isEntryUnlocked(entry, gameState));
}

/**
 * Get locked entries by category
 * 
 * @param {string} category - Category to filter by
 * @param {Object} gameState - Current game state from Zustand store
 * @returns {Array} - Array of locked entries in the category
 */
export function getLockedEntriesByCategory(category, gameState) {
    return CODEX_ENTRIES
        .filter(entry => entry.category === category)
        .filter(entry => !isEntryUnlocked(entry, gameState));
}

/**
 * Get unlock hint for a locked entry
 * 
 * @param {Object} entry - Codex entry
 * @returns {string} - Human-readable unlock hint
 */
export function getUnlockHint(entry) {
    const { unlockCondition, unlockValue } = entry;

    switch (unlockCondition) {
        case CODEX_CONFIG.UNLOCK_CONDITIONS.ALWAYS:
            return 'Already unlocked';

        case CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_CROP:
            return `Plant ${unlockValue} to unlock`;

        case CODEX_CONFIG.UNLOCK_CONDITIONS.HARVEST_CROP:
            if (unlockValue === 'any') {
                return 'Harvest any crop to unlock';
            }
            return `Harvest ${unlockValue} to unlock`;

        case CODEX_CONFIG.UNLOCK_CONDITIONS.REACH_DAY:
            return `Reach day ${unlockValue} to unlock`;

        case CODEX_CONFIG.UNLOCK_CONDITIONS.EARN_COINS:
            return `Earn ${unlockValue} coins to unlock`;

        case CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_DIVERSITY:
            return `Plant ${unlockValue} different crops to unlock`;

        default:
            return 'Unlock condition unknown';
    }
}

/**
 * Get progress toward unlocking an entry
 * 
 * @param {Object} entry - Codex entry
 * @param {Object} gameState - Current game state from Zustand store
 * @returns {Object} - { current, required, percentage }
 */
export function getUnlockProgress(entry, gameState) {
    const { unlockCondition, unlockValue } = entry;

    switch (unlockCondition) {
        case CODEX_CONFIG.UNLOCK_CONDITIONS.REACH_DAY: {
            const currentDay = gameState.game?.currentDay || 1;
            return {
                current: currentDay,
                required: unlockValue,
                percentage: Math.min(100, (currentDay / unlockValue) * 100),
            };
        }

        case CODEX_CONFIG.UNLOCK_CONDITIONS.EARN_COINS: {
            const coins = gameState.inventory?.coins || 0;
            return {
                current: coins,
                required: unlockValue,
                percentage: Math.min(100, (coins / unlockValue) * 100),
            };
        }

        case CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_DIVERSITY: {
            const tiles = gameState.farm?.tiles || [];
            const uniqueCrops = new Set(
                tiles
                    .filter(tile => tile.crop)
                    .map(tile => tile.crop)
            );
            return {
                current: uniqueCrops.size,
                required: unlockValue,
                percentage: Math.min(100, (uniqueCrops.size / unlockValue) * 100),
            };
        }

        default:
            return {
                current: 0,
                required: 1,
                percentage: 0,
            };
    }
}

/**
 * Track newly unlocked entries and update session analytics
 * 
 * @param {Object} gameState - Current game state from Zustand store
 * @param {Function} trackEvent - Function to track analytics events
 */
export function trackNewlyUnlockedEntries(gameState, trackEvent) {
    const unlockedEntries = getUnlockedEntries(gameState);
    const previouslyUnlocked = gameState.session?.analytics?.codexEntriesUnlocked || [];

    const newlyUnlocked = unlockedEntries
        .filter(entry => !previouslyUnlocked.includes(entry.id))
        .map(entry => entry.id);

    if (newlyUnlocked.length > 0) {
        trackEvent('codex_entries_unlocked', {
            codexEntriesUnlocked: [...previouslyUnlocked, ...newlyUnlocked],
        });
    }

    return newlyUnlocked;
}
