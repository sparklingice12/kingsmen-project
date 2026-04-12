/**
 * Sustainability Score Configuration
 * 
 * Defines scoring rules and thresholds for sustainable farming practices
 */

export const SUSTAINABILITY_CONFIG = {
    // Score range
    MIN_SCORE: 0,
    MAX_SCORE: 100,

    // Achievement threshold
    ACHIEVEMENT_THRESHOLD: 80,

    // Points awarded for positive actions
    POINTS: {
        CROP_DIVERSITY_PER_TYPE: 5,      // +5 points per unique crop type planted in a day
        WATER_EFFICIENCY_PER_DAY: 2,     // +2 points per day with no over-watering
        NO_WITHERED_CROPS_BONUS: 5,      // +5 points if no crops withered during the day
    },

    // Points deducted for negative actions
    PENALTIES: {
        WITHERED_CROP: 3,                // -3 points per withered crop
        OVER_WATERING: 1,                // -1 point per over-watered tile
    },

    // Tracking thresholds
    THRESHOLDS: {
        MIN_DIVERSITY_FOR_BONUS: 2,      // Minimum unique crop types for diversity bonus
        MAX_DIVERSITY_BONUS: 4,          // Maximum unique crop types counted (4 types max)
    },

    // Feedback messages
    FEEDBACK: {
        EXCELLENT: {
            threshold: 80,
            message: 'Excellent! Your sustainable farming practices are outstanding!',
            badge: 'sustainability-champion'
        },
        GOOD: {
            threshold: 60,
            message: 'Good work! You\'re practicing sustainable farming.',
            badge: 'eco-farmer'
        },
        FAIR: {
            threshold: 40,
            message: 'Fair. Try planting diverse crops and watering efficiently.',
            badge: null
        },
        POOR: {
            threshold: 0,
            message: 'Keep learning! Focus on crop diversity and preventing withering.',
            badge: null
        }
    },

    // Tips for improving score
    TIPS: {
        LOW_DIVERSITY: 'Plant different crop types to improve soil health and biodiversity.',
        WITHERED_CROPS: 'Water your crops regularly to prevent withering.',
        OVER_WATERING: 'Avoid watering crops that are already watered or fully grown.',
        GOOD_PRACTICES: 'Keep up the great work! Diverse crops and efficient watering help the environment.'
    }
};
