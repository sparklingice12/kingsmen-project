/**
 * Summary Configuration
 * 
 * Defines scoring rules and tip generation for end-of-day summary.
 * Requirements: 2.3.1, 2.3.2, 2.3.3, 2.3.4, 2.3.7
 */

export const SUMMARY_CONFIG = {
    // Sustainability scoring weights
    SCORING: {
        BASE_SCORE: 50,
        DIVERSITY_BONUS_PER_CROP: 10,
        MAX_DIVERSITY_BONUS: 30,
        WATER_EFFICIENCY_BONUS: 20,
        EMPTY_TILE_PENALTY_MULTIPLIER: 40,
        MAX_EMPTY_PENALTY: 20,
    },

    // Sustainability thresholds
    THRESHOLDS: {
        EXCELLENT: 80,
        GOOD: 60,
        POOR: 40,
    },

    // Tip categories
    TIPS: {
        DIVERSITY: {
            condition: (uniqueCrops) => uniqueCrops < 3,
            message: 'Try planting different crop types to improve soil health and biodiversity.',
        },
        WATER_MANAGEMENT: {
            condition: (unwateredCount) => unwateredCount > 0,
            message: 'Remember to water your crops regularly for faster growth.',
        },
        EMPTY_TILES: {
            condition: (emptyCount) => emptyCount > 20,
            message: 'Use your hoe to till more soil and expand your farm.',
        },
        HARVEST_READY: {
            condition: (readyCount) => readyCount > 0,
            messageTemplate: (count) => `You have ${count} crops ready to harvest!`,
        },
        SUSTAINABILITY_HIGH: {
            condition: (score) => score >= 80,
            message: 'Keep up the excellent sustainable farming practices!',
        },
        SUSTAINABILITY_LOW: {
            condition: (score) => score < 50,
            message: 'Focus on crop rotation and efficient water use to improve sustainability.',
        },
    },

    // Maximum tips to show
    MAX_TIPS: 3,

    // Achievement messages
    ACHIEVEMENTS: {
        EXCELLENT_FARMING: {
            threshold: 80,
            title: 'Excellent Farming!',
            description: "You're practicing sustainable agriculture!",
            icon: '🏆',
        },
        GOOD_PROGRESS: {
            threshold: 60,
            title: 'Good Progress!',
            description: 'Your farm is developing well!',
            icon: '⭐',
        },
    },
};

/**
 * Calculate sustainability score based on farming practices
 */
export function calculateSustainabilityScore(tiles, plantedTiles) {
    let score = SUMMARY_CONFIG.SCORING.BASE_SCORE;

    // Crop diversity bonus (up to +30 points)
    const uniqueCrops = new Set(plantedTiles.map(t => t.crop).filter(Boolean));
    const diversityBonus = Math.min(
        SUMMARY_CONFIG.SCORING.MAX_DIVERSITY_BONUS,
        uniqueCrops.size * SUMMARY_CONFIG.SCORING.DIVERSITY_BONUS_PER_CROP
    );
    score += diversityBonus;

    // Water efficiency bonus (up to +20 points)
    const wateredTiles = tiles.filter(t => t.isWatered);
    const waterEfficiency = wateredTiles.length / Math.max(1, plantedTiles.length);
    const waterBonus = Math.min(
        SUMMARY_CONFIG.SCORING.WATER_EFFICIENCY_BONUS,
        waterEfficiency * SUMMARY_CONFIG.SCORING.WATER_EFFICIENCY_BONUS
    );
    score += waterBonus;

    // Penalty for empty tiles (up to -20 points)
    const emptyTiles = tiles.filter(t => t.state === 'untilled');
    const emptyPenalty = Math.min(
        SUMMARY_CONFIG.SCORING.MAX_EMPTY_PENALTY,
        (emptyTiles.length / tiles.length) * SUMMARY_CONFIG.SCORING.EMPTY_TILE_PENALTY_MULTIPLIER
    );
    score -= emptyPenalty;

    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Generate contextual tips based on player actions
 */
export function generateTips(tiles, plantedTiles, sustainabilityScore) {
    const tips = [];

    // Crop diversity tip
    const uniqueCrops = new Set(plantedTiles.map(t => t.crop).filter(Boolean));
    if (SUMMARY_CONFIG.TIPS.DIVERSITY.condition(uniqueCrops.size)) {
        tips.push(SUMMARY_CONFIG.TIPS.DIVERSITY.message);
    }

    // Water management tip
    const unwateredCrops = plantedTiles.filter(t => !t.isWatered);
    if (SUMMARY_CONFIG.TIPS.WATER_MANAGEMENT.condition(unwateredCrops.length)) {
        tips.push(SUMMARY_CONFIG.TIPS.WATER_MANAGEMENT.message);
    }

    // Empty tiles tip
    const emptyTiles = tiles.filter(t => t.state === 'untilled');
    if (SUMMARY_CONFIG.TIPS.EMPTY_TILES.condition(emptyTiles.length)) {
        tips.push(SUMMARY_CONFIG.TIPS.EMPTY_TILES.message);
    }

    // Harvest tip
    const readyToHarvest = tiles.filter(t => t.state === 'ready');
    if (SUMMARY_CONFIG.TIPS.HARVEST_READY.condition(readyToHarvest.length)) {
        tips.push(SUMMARY_CONFIG.TIPS.HARVEST_READY.messageTemplate(readyToHarvest.length));
    }

    // Sustainability encouragement
    if (SUMMARY_CONFIG.TIPS.SUSTAINABILITY_HIGH.condition(sustainabilityScore)) {
        tips.push(SUMMARY_CONFIG.TIPS.SUSTAINABILITY_HIGH.message);
    } else if (SUMMARY_CONFIG.TIPS.SUSTAINABILITY_LOW.condition(sustainabilityScore)) {
        tips.push(SUMMARY_CONFIG.TIPS.SUSTAINABILITY_LOW.message);
    }

    // Limit to max tips
    return tips.slice(0, SUMMARY_CONFIG.MAX_TIPS);
}

/**
 * Get achievement for sustainability score
 */
export function getAchievement(score) {
    if (score >= SUMMARY_CONFIG.ACHIEVEMENTS.EXCELLENT_FARMING.threshold) {
        return SUMMARY_CONFIG.ACHIEVEMENTS.EXCELLENT_FARMING;
    }
    if (score >= SUMMARY_CONFIG.ACHIEVEMENTS.GOOD_PROGRESS.threshold) {
        return SUMMARY_CONFIG.ACHIEVEMENTS.GOOD_PROGRESS;
    }
    return null;
}
