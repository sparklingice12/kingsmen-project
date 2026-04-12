/**
 * Quest Service
 * 
 * Handles quest progress tracking, completion checking, and reward distribution
 */

import { QUEST_TYPES, REWARD_TYPES, getQuestById } from './quests.config';

/**
 * Check if a quest is completed based on current progress
 */
export function isQuestComplete(quest) {
    if (!quest) return false;
    return quest.current >= quest.target;
}

/**
 * Calculate quest progress for a specific quest type
 * 
 * @param {string} questId - Quest identifier
 * @param {object} gameState - Current game state from Zustand
 * @returns {number} Current progress value
 */
export function calculateQuestProgress(questId, gameState) {
    const questConfig = getQuestById(questId);
    if (!questConfig) return 0;

    const { type } = questConfig;
    const { farm, inventory, session } = gameState;

    console.log(`📋 Calculating progress for quest: ${questId}`, {
        type,
        sessionAnalytics: session.analytics
    });

    switch (type) {
        case QUEST_TYPES.PLANT: {
            // Count total crops planted (from analytics)
            if (questId === 'first_plant') {
                const progress = session.analytics.cropsPlanted || 0;
                console.log(`  ✅ First plant progress: ${progress}`);
                return progress;
            }

            // Count currently growing crops
            if (questId === 'full_garden') {
                return farm.tiles.filter(t => t.crop !== null).length;
            }

            return session.analytics.cropsPlanted || 0;
        }

        case QUEST_TYPES.HARVEST: {
            // Count total harvested crops
            if (questId === 'harvest_five') {
                return session.analytics.cropsHarvested || 0;
            }

            // Count specific crop type harvested
            if (questId === 'harvest_tomatoes') {
                return inventory.harvested.tomato || 0;
            }

            return session.analytics.cropsHarvested || 0;
        }

        case QUEST_TYPES.DIVERSITY: {
            // Count unique crop types planted
            if (questId === 'diverse_farm') {
                const plantedCrops = farm.tiles
                    .filter(t => t.crop !== null)
                    .map(t => t.crop);
                const uniqueCrops = new Set(plantedCrops);
                return uniqueCrops.size;
            }

            return 0;
        }

        case QUEST_TYPES.SUSTAINABILITY: {
            // Use sustainability score
            return gameState.sustainability?.currentScore || 0;
        }

        default:
            return 0;
    }
}

/**
 * Update quest progress in the quest state
 * 
 * @param {object} quest - Quest object with current progress
 * @param {object} gameState - Current game state
 * @returns {object} Updated quest with new progress
 */
export function updateQuestProgress(quest, gameState) {
    if (!quest || quest.completed) return quest;

    const newProgress = calculateQuestProgress(quest.id, gameState);

    return {
        ...quest,
        current: newProgress,
        completed: newProgress >= quest.target,
    };
}

/**
 * Apply quest reward to game state
 * 
 * @param {object} reward - Reward object from quest config
 * @param {object} store - Zustand store instance
 */
export function applyQuestReward(reward, store) {
    if (!reward) return;

    const { type, value } = reward;

    switch (type) {
        case REWARD_TYPES.COINS:
            store.getState().inventory.addCoins(value);
            break;

        case REWARD_TYPES.CODEX:
            // Unlock codex entry
            const currentUnlocked = store.getState().session.analytics.codexEntriesUnlocked || [];
            if (!currentUnlocked.includes(value)) {
                store.getState().session.trackEvent('codex_unlock', {
                    codexEntriesUnlocked: [...currentUnlocked, value]
                });
            }
            break;

        case REWARD_TYPES.SEEDS:
            // Add seeds to inventory
            Object.entries(value).forEach(([seedType, quantity]) => {
                store.getState().inventory.addSeeds(seedType, quantity);
            });
            break;

        default:
            console.warn(`Unknown reward type: ${type}`);
    }
}

/**
 * Get reward description text for display
 * 
 * @param {object} reward - Reward object
 * @returns {string} Human-readable reward description
 */
export function getRewardDescription(reward) {
    if (!reward) return '';

    const { type, value } = reward;

    switch (type) {
        case REWARD_TYPES.COINS:
            return `${value} coins`;

        case REWARD_TYPES.CODEX:
            return 'Unlock Codex entry';

        case REWARD_TYPES.SEEDS:
            const seedDescriptions = Object.entries(value).map(
                ([seedType, quantity]) => `${quantity} ${seedType} seed${quantity > 1 ? 's' : ''}`
            );
            return seedDescriptions.join(', ');

        default:
            return 'Unknown reward';
    }
}

/**
 * Check all active quests and update their progress
 * 
 * @param {array} activeQuests - Array of active quest objects
 * @param {object} gameState - Current game state
 * @returns {array} Updated quests with new progress
 */
export function updateAllQuestProgress(activeQuests, gameState) {
    return activeQuests.map(quest => updateQuestProgress(quest, gameState));
}

/**
 * Get newly completed quests from updated quest list
 * 
 * @param {array} previousQuests - Quests before update
 * @param {array} updatedQuests - Quests after update
 * @returns {array} Quests that just became completed
 */
export function getNewlyCompletedQuests(previousQuests, updatedQuests) {
    return updatedQuests.filter((quest, index) => {
        const wasCompleted = previousQuests[index]?.completed || false;
        const isNowCompleted = quest.completed;
        return !wasCompleted && isNowCompleted;
    });
}
