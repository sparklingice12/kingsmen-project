/**
 * Sustainability Score Service
 * 
 * Tracks and calculates sustainability score based on farming practices
 */

import { SUSTAINABILITY_CONFIG } from './sustainability.config';

/**
 * Calculate sustainability score for a day based on farming actions
 * @param {Object} dayData - Data about the day's farming activities
 * @param {Array<string>} dayData.cropsPlanted - Array of crop types planted today
 * @param {number} dayData.witheredCrops - Number of crops that withered today
 * @param {number} dayData.overWateredTiles - Number of tiles that were over-watered
 * @param {boolean} dayData.efficientWatering - Whether watering was efficient (no over-watering)
 * @returns {Object} Score calculation result
 */
export function calculateDayScore(dayData) {
    const {
        cropsPlanted = [],
        witheredCrops = 0,
        overWateredTiles = 0,
        efficientWatering = true
    } = dayData;

    let score = 0;
    const breakdown = {
        diversity: 0,
        waterEfficiency: 0,
        noWithering: 0,
        penalties: 0
    };

    // Calculate crop diversity bonus
    const uniqueCrops = new Set(cropsPlanted);
    const diversityCount = Math.min(
        uniqueCrops.size,
        SUSTAINABILITY_CONFIG.THRESHOLDS.MAX_DIVERSITY_BONUS
    );

    if (diversityCount >= SUSTAINABILITY_CONFIG.THRESHOLDS.MIN_DIVERSITY_FOR_BONUS) {
        breakdown.diversity = diversityCount * SUSTAINABILITY_CONFIG.POINTS.CROP_DIVERSITY_PER_TYPE;
        score += breakdown.diversity;
    }

    // Calculate water efficiency bonus
    if (efficientWatering && overWateredTiles === 0) {
        breakdown.waterEfficiency = SUSTAINABILITY_CONFIG.POINTS.WATER_EFFICIENCY_PER_DAY;
        score += breakdown.waterEfficiency;
    }

    // Calculate no withering bonus
    if (witheredCrops === 0 && cropsPlanted.length > 0) {
        breakdown.noWithering = SUSTAINABILITY_CONFIG.POINTS.NO_WITHERED_CROPS_BONUS;
        score += breakdown.noWithering;
    }

    // Apply penalties
    const witheredPenalty = witheredCrops * SUSTAINABILITY_CONFIG.PENALTIES.WITHERED_CROP;
    const overWateringPenalty = overWateredTiles * SUSTAINABILITY_CONFIG.PENALTIES.OVER_WATERING;
    breakdown.penalties = -(witheredPenalty + overWateringPenalty);
    score += breakdown.penalties;

    return {
        score: Math.max(0, score), // Don't allow negative scores
        breakdown,
        uniqueCropsCount: uniqueCrops.size,
        witheredCrops,
        overWateredTiles
    };
}

/**
 * Calculate cumulative sustainability score across multiple days
 * @param {Array<Object>} dailyScores - Array of daily score results
 * @returns {number} Total sustainability score (0-100)
 */
export function calculateTotalScore(dailyScores) {
    if (!dailyScores || dailyScores.length === 0) return 0;

    const totalPoints = dailyScores.reduce((sum, day) => sum + day.score, 0);
    const averageScore = totalPoints / dailyScores.length;

    // Normalize to 0-100 scale
    // Assuming a perfect day could score ~20 points (4 crops * 5 + 2 water + 5 no withering)
    const maxPossibleDailyScore = 27;
    const normalizedScore = Math.min(
        SUSTAINABILITY_CONFIG.MAX_SCORE,
        (averageScore / maxPossibleDailyScore) * 100
    );

    return Math.round(normalizedScore);
}

/**
 * Get feedback message and badge based on score
 * @param {number} score - Sustainability score (0-100)
 * @returns {Object} Feedback object with message and badge
 */
export function getFeedback(score) {
    const { FEEDBACK } = SUSTAINABILITY_CONFIG;

    if (score >= FEEDBACK.EXCELLENT.threshold) {
        return {
            level: 'excellent',
            message: FEEDBACK.EXCELLENT.message,
            badge: FEEDBACK.EXCELLENT.badge
        };
    } else if (score >= FEEDBACK.GOOD.threshold) {
        return {
            level: 'good',
            message: FEEDBACK.GOOD.message,
            badge: FEEDBACK.GOOD.badge
        };
    } else if (score >= FEEDBACK.FAIR.threshold) {
        return {
            level: 'fair',
            message: FEEDBACK.FAIR.message,
            badge: FEEDBACK.FAIR.badge
        };
    } else {
        return {
            level: 'poor',
            message: FEEDBACK.POOR.message,
            badge: FEEDBACK.POOR.badge
        };
    }
}

/**
 * Get tips for improving sustainability score
 * @param {Object} dayData - Data about recent farming activities
 * @returns {Array<string>} Array of tip messages
 */
export function getTips(dayData) {
    const tips = [];
    const { TIPS } = SUSTAINABILITY_CONFIG;

    const {
        cropsPlanted = [],
        witheredCrops = 0,
        overWateredTiles = 0,
        totalScore = 0
    } = dayData;

    // Ensure cropsPlanted is an array
    const cropsArray = Array.isArray(cropsPlanted) ? cropsPlanted : [];
    const uniqueCrops = new Set(cropsArray);

    // Low diversity tip
    if (uniqueCrops.size < SUSTAINABILITY_CONFIG.THRESHOLDS.MIN_DIVERSITY_FOR_BONUS) {
        tips.push(TIPS.LOW_DIVERSITY);
    }

    // Withered crops tip
    if (witheredCrops > 0) {
        tips.push(TIPS.WITHERED_CROPS);
    }

    // Over-watering tip
    if (overWateredTiles > 0) {
        tips.push(TIPS.OVER_WATERING);
    }

    // Good practices encouragement
    if (totalScore >= SUSTAINABILITY_CONFIG.FEEDBACK.GOOD.threshold) {
        tips.push(TIPS.GOOD_PRACTICES);
    }

    return tips;
}

/**
 * Track daily farming activities for sustainability scoring
 * @param {Array<Object>} tiles - Current farm tiles
 * @param {Object} previousDayTiles - Tiles from previous day
 * @returns {Object} Daily activity data
 */
export function trackDailyActivities(tiles, previousDayTiles = []) {
    const cropsPlanted = [];
    let witheredCrops = 0;
    let overWateredTiles = 0;

    tiles.forEach((tile, index) => {
        // Track newly planted crops
        if (tile.crop && tile.daysPlanted === 0) {
            cropsPlanted.push(tile.crop);
        }

        // Track withered crops (crops that lost growth stage)
        if (previousDayTiles[index]) {
            const prevTile = previousDayTiles[index];
            if (prevTile.crop && tile.crop === prevTile.crop) {
                if (tile.growthStage < prevTile.growthStage) {
                    witheredCrops++;
                }
            }
        }

        // Track over-watering (watering already watered tiles or ready crops)
        if (tile.isWatered && tile.wateredDaysRemaining > 1) {
            overWateredTiles++;
        }
    });

    const efficientWatering = overWateredTiles === 0;

    return {
        cropsPlanted,
        witheredCrops,
        overWateredTiles,
        efficientWatering
    };
}

/**
 * Initialize sustainability tracking in store
 * @returns {Object} Initial sustainability state
 */
export function initializeSustainabilityState() {
    return {
        currentScore: 0,
        dailyScores: [],
        currentDayData: {
            cropsPlanted: [],
            witheredCrops: 0,
            overWateredTiles: 0,
            efficientWatering: true
        },
        achievementUnlocked: false,
        feedback: null
    };
}
