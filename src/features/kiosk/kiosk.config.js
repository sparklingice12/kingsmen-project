/**
 * Kiosk Configuration
 * Settings for kiosk-specific features like auto-reset and attract mode
 */

export const kioskConfig = {
    // Auto-reset settings
    INACTIVITY_TIMEOUT: 10 * 60 * 1000, // 10 minutes in milliseconds
    WARNING_DURATION: 30 * 1000, // 30 seconds warning before reset
    SESSION_EXTENSION: 10 * 60 * 1000, // 10 minutes extension when user continues

    // Attract mode settings
    ATTRACT_MODE_DELAY: 30 * 1000, // 30 seconds of inactivity before attract mode
    ATTRACT_MODE_ANIMATION_DURATION: 5000, // 5 seconds per animation cycle

    // Analytics settings
    MAX_RESET_HISTORY: 100, // Maximum number of reset events to store

    // Performance settings
    INACTIVITY_CHECK_INTERVAL: 1000, // Check inactivity every 1 second

    // Debug settings (set to true for development)
    DEBUG_MODE: import.meta.env.DEV,
    REDUCED_TIMEOUTS: import.meta.env.DEV, // Use shorter timeouts in development
};

// Legacy export for backward compatibility
export const KIOSK_CONFIG = kioskConfig;

// Development overrides for faster testing
if (kioskConfig.REDUCED_TIMEOUTS) {
    kioskConfig.INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds in dev
    kioskConfig.WARNING_DURATION = 10 * 1000; // 10 seconds warning in dev
    kioskConfig.ATTRACT_MODE_DELAY = 10 * 1000; // 10 seconds in dev
}

/**
 * Get analytics export data for curators
 */
export function getAnalyticsExport() {
    const resetHistory = JSON.parse(localStorage.getItem('heritage-harvest-resets') || '[]');
    const sessionAnalytics = JSON.parse(localStorage.getItem('heritage-harvest-storage') || '{}');

    return {
        exportDate: new Date().toISOString(),
        resetHistory,
        sessionAnalytics: sessionAnalytics.state?.session?.analytics || {},
        totalResets: resetHistory.length,
        averageSessionDuration: resetHistory.length > 0
            ? resetHistory.reduce((sum, reset) => sum + (reset.sessionDuration || 0), 0) / resetHistory.length
            : 0,
    };
}

/**
 * Clear all analytics data (admin function)
 */
export function clearAnalyticsData() {
    localStorage.removeItem('heritage-harvest-resets');
    localStorage.removeItem('heritage-harvest-storage');
    console.log('🗑️ Analytics data cleared');
}

/**
 * Export analytics as downloadable JSON file
 */
export function downloadAnalyticsExport() {
    const data = getAnalyticsExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `heritage-harvest-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    console.log('📊 Analytics exported');
}