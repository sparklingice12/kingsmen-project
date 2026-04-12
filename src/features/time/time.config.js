/**
 * Time Configuration
 * 
 * Defines time cycle settings for the accelerated day/night system.
 * Requirements: 1.5.1, 1.5.3
 */

export const TIME_CONFIG = {
    // Day cycle duration (in seconds)
    DAY_DURATION_MIN: 90,  // Minimum 90 seconds per day
    DAY_DURATION_MAX: 120, // Maximum 120 seconds per day
    DAY_DURATION_DEFAULT: 100, // Default 100 seconds per day

    // Hour duration (in seconds) - for crop growth
    HOURS_PER_DAY: 24,
    get HOUR_DURATION() {
        return this.DAY_DURATION_DEFAULT / this.HOURS_PER_DAY; // ~4.17 seconds per hour
    },

    // Time of day labels
    TIME_LABELS: {
        MORNING: 'Morning',
        MIDDAY: 'Midday',
        AFTERNOON: 'Afternoon',
        EVENING: 'Evening',
        NIGHT: 'Night',
    },

    // Time of day ranges (0-1)
    TIME_RANGES: {
        MORNING: { start: 0, end: 0.25 },
        MIDDAY: { start: 0.25, end: 0.5 },
        AFTERNOON: { start: 0.5, end: 0.75 },
        EVENING: { start: 0.75, end: 1.0 },
    },
};

/**
 * Get time of day label based on progress (0-1)
 */
export function getTimeLabel(timeOfDay) {
    if (timeOfDay < 0.25) return TIME_CONFIG.TIME_LABELS.MORNING;
    if (timeOfDay < 0.5) return TIME_CONFIG.TIME_LABELS.MIDDAY;
    if (timeOfDay < 0.75) return TIME_CONFIG.TIME_LABELS.AFTERNOON;
    return TIME_CONFIG.TIME_LABELS.EVENING;
}

/**
 * Get time progress percentage (0-100)
 */
export function getTimeProgress(timeOfDay) {
    return Math.round(timeOfDay * 100);
}

/**
 * Get current hour of day (0-23)
 */
export function getCurrentHour(timeOfDay) {
    return Math.floor(timeOfDay * TIME_CONFIG.HOURS_PER_DAY);
}

/**
 * Get hour progress within current hour (0-1)
 */
export function getHourProgress(timeOfDay) {
    const hourFraction = (timeOfDay * TIME_CONFIG.HOURS_PER_DAY) % 1;
    return hourFraction;
}
