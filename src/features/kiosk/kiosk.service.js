import { KIOSK_CONFIG } from './kiosk.config';

/**
 * Kiosk Service
 * Handles session management, analytics tracking, and reset functionality
 */

/**
 * Track user interaction to reset inactivity timer
 */
export function trackUserInteraction() {
    // This will be called by the store's updateInteraction method
    const timestamp = Date.now();

    if (KIOSK_CONFIG.DEBUG_MODE) {
        console.log('👆 User interaction tracked at', new Date(timestamp).toLocaleTimeString());
    }

    return timestamp;
}

/**
 * Check if session should show inactivity warning
 */
export function shouldShowInactivityWarning(lastInteraction) {
    const timeSinceInteraction = Date.now() - lastInteraction;
    return timeSinceInteraction >= KIOSK_CONFIG.INACTIVITY_TIMEOUT;
}

/**
 * Check if session should auto-reset
 */
export function shouldAutoReset(lastInteraction) {
    const timeSinceInteraction = Date.now() - lastInteraction;
    return timeSinceInteraction >= (KIOSK_CONFIG.INACTIVITY_TIMEOUT + KIOSK_CONFIG.WARNING_DURATION);
}

/**
 * Get time remaining until inactivity warning
 */
export function getTimeUntilWarning(lastInteraction) {
    const timeSinceInteraction = Date.now() - lastInteraction;
    return Math.max(0, KIOSK_CONFIG.INACTIVITY_TIMEOUT - timeSinceInteraction);
}

/**
 * Get time remaining until auto-reset
 */
export function getTimeUntilReset(lastInteraction) {
    const timeSinceInteraction = Date.now() - lastInteraction;
    const totalTimeout = KIOSK_CONFIG.INACTIVITY_TIMEOUT + KIOSK_CONFIG.WARNING_DURATION;
    return Math.max(0, totalTimeout - timeSinceInteraction);
}

/**
 * Log a reset event for analytics
 */
export function logResetEvent(reason = 'inactivity', sessionStartTime = null) {
    const resetEvent = {
        timestamp: Date.now(),
        reason,
        sessionDuration: sessionStartTime ? Date.now() - sessionStartTime : 0,
        date: new Date().toISOString(),
    };

    // Get existing reset history
    const resetHistory = JSON.parse(localStorage.getItem('heritage-harvest-resets') || '[]');

    // Add new event
    resetHistory.push(resetEvent);

    // Keep only the most recent events (prevent localStorage from growing too large)
    if (resetHistory.length > KIOSK_CONFIG.MAX_RESET_HISTORY) {
        resetHistory.splice(0, resetHistory.length - KIOSK_CONFIG.MAX_RESET_HISTORY);
    }

    // Save back to localStorage
    localStorage.setItem('heritage-harvest-resets', JSON.stringify(resetHistory));

    console.log('📝 Reset event logged:', resetEvent);
    return resetEvent;
}

/**
 * Get session analytics summary
 */
export function getSessionSummary(sessionState) {
    const { analytics, startTime } = sessionState;
    const sessionDuration = startTime ? Date.now() - startTime : 0;

    return {
        sessionDuration: Math.round(sessionDuration / 1000), // in seconds
        cropsPlanted: analytics.cropsPlanted || 0,
        cropsHarvested: analytics.cropsHarvested || 0,
        modalsOpened: analytics.modalsOpened || 0,
        codexEntriesUnlocked: (analytics.codexEntriesUnlocked || []).length,
        finalSustainabilityScore: analytics.finalSustainabilityScore || 0,
        viewedModals: (analytics.viewedModals || []).length,
    };
}

/**
 * Format time duration for display
 */
export function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Format countdown timer for display
 */
export function formatCountdown(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0) {
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
        return secs.toString();
    }
}

/**
 * Check if attract mode should be activated
 */
export function shouldActivateAttractMode(lastInteraction, isPlaying) {
    if (isPlaying) return false; // Don't activate during gameplay

    const timeSinceInteraction = Date.now() - lastInteraction;
    return timeSinceInteraction >= KIOSK_CONFIG.ATTRACT_MODE_DELAY;
}

/**
 * Validate session state for reset
 */
export function validateSessionForReset(sessionState) {
    const issues = [];

    if (!sessionState.startTime) {
        issues.push('No session start time recorded');
    }

    if (!sessionState.lastInteraction) {
        issues.push('No last interaction time recorded');
    }

    if (!sessionState.analytics) {
        issues.push('No analytics data found');
    }

    return {
        isValid: issues.length === 0,
        issues,
    };
}

/**
 * Prepare session data for preservation before reset
 */
export function preserveSessionData(sessionState) {
    const summary = getSessionSummary(sessionState);
    const validation = validateSessionForReset(sessionState);

    const preservedData = {
        timestamp: Date.now(),
        sessionSummary: summary,
        validation,
        analytics: sessionState.analytics,
    };

    // Store in a separate key for preserved sessions
    const preservedSessions = JSON.parse(localStorage.getItem('heritage-harvest-preserved-sessions') || '[]');
    preservedSessions.push(preservedData);

    // Keep only recent sessions
    if (preservedSessions.length > 50) {
        preservedSessions.splice(0, preservedSessions.length - 50);
    }

    localStorage.setItem('heritage-harvest-preserved-sessions', JSON.stringify(preservedSessions));

    console.log('💾 Session data preserved:', preservedData);
    return preservedData;
}

/**
 * Perform complete session reset
 * Requirements: 3.2.3, 3.2.4, 3.2.5, 3.2.7
 * 
 * @param {Object} store - Zustand store instance
 * @param {string} reason - Reason for reset ('inactivity', 'manual', 'error')
 * @returns {Object} Reset result with preserved data and reset event
 */
export function performSessionReset(store, reason = 'inactivity') {
    const state = store.getState();

    // 1. Preserve session analytics before reset (Requirement 3.2.4)
    const preservedData = preserveSessionData(state.session);

    // 2. Log reset event with timestamp (Requirement 3.2.7)
    const resetEvent = logResetEvent(reason, state.session.startTime);

    // 3. Reset all game state (farm, inventory, coins, score) - Requirement 3.2.3
    state.session.resetSession();

    // 4. Return to attract mode (Requirement 3.2.5)
    setTimeout(() => {
        state.game.setAttractMode(true);
    }, 100);

    console.log('✅ Session reset complete:', {
        reason,
        preservedData,
        resetEvent,
    });

    return {
        success: true,
        preservedData,
        resetEvent,
    };
}

/**
 * Get all preserved session data
 */
export function getPreservedSessions() {
    return JSON.parse(localStorage.getItem('heritage-harvest-preserved-sessions') || '[]');
}

/**
 * Get all reset events
 */
export function getResetHistory() {
    return JSON.parse(localStorage.getItem('heritage-harvest-resets') || '[]');
}

/**
 * Clear preserved session data (admin function)
 */
export function clearPreservedSessions() {
    localStorage.removeItem('heritage-harvest-preserved-sessions');
    console.log('🗑️ Preserved sessions cleared');
}