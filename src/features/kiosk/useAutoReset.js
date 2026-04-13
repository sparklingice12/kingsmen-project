import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/state/store';
import {
    shouldShowInactivityWarning,
    shouldAutoReset,
    getTimeUntilReset,
    performSessionReset
} from './kiosk.service';
import { KIOSK_CONFIG } from './kiosk.config';

/**
 * Hook for managing auto-reset functionality
 * Handles inactivity detection, warning display, and session reset
 */
export function useAutoReset() {
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [timeUntilReset, setTimeUntilReset] = useState(0);

    // Use ref to prevent stale closure issues
    const warningShownRef = useRef(false);
    const resetInProgressRef = useRef(false);

    // Store selectors
    const session = useStore((s) => s.session);
    const game = useStore((s) => s.game);

    // Calculate time since last interaction
    const getTimeSinceLastInteraction = useCallback(() => {
        return Date.now() - session.lastInteraction;
    }, [session.lastInteraction]);

    // Handle session reset
    const handleReset = useCallback(async () => {
        if (resetInProgressRef.current) return;
        resetInProgressRef.current = true;

        console.log('🔄 Auto-reset initiated');

        try {
            // Use the comprehensive reset function
            // This handles: preserve analytics, log event, reset state, return to attract mode
            const result = performSessionReset(useStore, 'inactivity');

            if (result.success) {
                // Hide warning
                setShowWarning(false);
                setCountdown(0);
                warningShownRef.current = false;

                console.log('✅ Auto-reset completed successfully');
            } else {
                console.error('❌ Auto-reset failed');
            }

        } catch (error) {
            console.error('❌ Error during auto-reset:', error);
        } finally {
            resetInProgressRef.current = false;
        }
    }, []);

    // Extend session by updating interaction time
    const extendSession = useCallback(() => {
        console.log('⏰ Session extended by user');

        // Update last interaction time
        useStore.getState().session.updateInteraction();

        // Hide warning
        setShowWarning(false);
        setCountdown(0);
        warningShownRef.current = false;

        // Log extension event (optional - for analytics)
        const extensionEvent = {
            timestamp: Date.now(),
            reason: 'session_extended',
            date: new Date().toISOString(),
        };

        const extensionHistory = JSON.parse(localStorage.getItem('heritage-harvest-extensions') || '[]');
        extensionHistory.push(extensionEvent);

        // Keep only recent extensions
        if (extensionHistory.length > 100) {
            extensionHistory.splice(0, extensionHistory.length - 100);
        }
        localStorage.setItem('heritage-harvest-extensions', JSON.stringify(extensionHistory));
    }, []);

    // Main inactivity monitoring effect
    useEffect(() => {
        // Only monitor during active gameplay
        if (!game.isPlaying || game.attractMode) {
            if (showWarning) {
                setShowWarning(false);
                setCountdown(0);
                warningShownRef.current = false;
            }
            return;
        }

        const checkInactivity = () => {
            const timeSinceInteraction = getTimeSinceLastInteraction();
            const timeUntilAutoReset = getTimeUntilReset(session.lastInteraction);

            setTimeUntilReset(timeUntilAutoReset);

            // Show warning if threshold reached and not already shown
            if (shouldShowInactivityWarning(session.lastInteraction) && !warningShownRef.current) {
                console.log('⚠️ Showing inactivity warning');
                setShowWarning(true);
                setCountdown(Math.ceil(KIOSK_CONFIG.WARNING_DURATION / 1000));
                warningShownRef.current = true;
            }

            // Auto-reset if final threshold reached
            if (shouldAutoReset(session.lastInteraction)) {
                handleReset();
            }
        };

        const interval = setInterval(checkInactivity, KIOSK_CONFIG.INACTIVITY_CHECK_INTERVAL);
        return () => clearInterval(interval);
    }, [
        game.isPlaying,
        game.attractMode,
        session.lastInteraction,
        getTimeSinceLastInteraction,
        handleReset,
        showWarning
    ]);

    // Countdown timer effect
    useEffect(() => {
        if (!showWarning || countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [showWarning, countdown]);

    // Auto-reset when countdown reaches 0
    useEffect(() => {
        if (showWarning && countdown <= 0) {
            handleReset();
        }
    }, [showWarning, countdown, handleReset]);

    // Reset warning state when game stops
    useEffect(() => {
        if (!game.isPlaying) {
            setShowWarning(false);
            setCountdown(0);
            warningShownRef.current = false;
        }
    }, [game.isPlaying]);

    return {
        showWarning,
        countdown,
        timeUntilReset,
        extendSession,
        handleReset,
        timeSinceLastInteraction: getTimeSinceLastInteraction(),
    };
}