import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/state/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KIOSK_CONFIG } from './kiosk.config';

/**
 * AutoReset component handles inactivity detection and session reset
 * Requirements: 3.2.1, 3.2.2, 3.2.3, 3.2.4, 3.2.5, 3.2.6, 3.2.7
 */
export default function AutoReset() {
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [timeUntilReset, setTimeUntilReset] = useState(0);

    const {
        lastInteraction,
        updateInteraction,
        resetSession
    } = useStore((s) => s.session);

    const {
        setAttractMode,
        isPlaying
    } = useStore((s) => s.game);

    const { t } = useStore((s) => s.language);

    // Calculate time since last interaction
    const getTimeSinceLastInteraction = useCallback(() => {
        return Date.now() - lastInteraction;
    }, [lastInteraction]);

    // Handle session reset
    const handleReset = useCallback(() => {
        const state = useStore.getState();

        // Preserve session analytics before reset (Requirement 3.2.4)
        const sessionData = {
            timestamp: Date.now(),
            reason: 'inactivity',
            sessionDuration: state.session.startTime ? Date.now() - state.session.startTime : 0,
            analytics: { ...state.session.analytics },
            date: new Date().toISOString(),
        };

        // Store preserved session data
        const preservedSessions = JSON.parse(localStorage.getItem('heritage-harvest-preserved-sessions') || '[]');
        preservedSessions.push(sessionData);

        // Keep only recent sessions (max 50)
        if (preservedSessions.length > 50) {
            preservedSessions.splice(0, preservedSessions.length - 50);
        }
        localStorage.setItem('heritage-harvest-preserved-sessions', JSON.stringify(preservedSessions));

        // Log reset event with timestamp (Requirement 3.2.7)
        const resetEvent = {
            timestamp: Date.now(),
            reason: 'inactivity',
            sessionDuration: sessionData.sessionDuration,
            date: new Date().toISOString(),
        };

        const resetHistory = JSON.parse(localStorage.getItem('heritage-harvest-resets') || '[]');
        resetHistory.push(resetEvent);

        // Keep only recent resets (max 100)
        if (resetHistory.length > 100) {
            resetHistory.splice(0, resetHistory.length - 100);
        }
        localStorage.setItem('heritage-harvest-resets', JSON.stringify(resetHistory));

        console.log('🔄 Session reset triggered:', {
            reason: 'inactivity',
            sessionDuration: `${Math.round(sessionData.sessionDuration / 1000)}s`,
            analytics: sessionData.analytics,
        });

        // Hide warning first
        setShowWarning(false);
        setCountdown(0);

        // Reset all game state (farm, inventory, coins, score) - Requirement 3.2.3
        resetSession();

        // Small delay to ensure state is fully updated before showing attract mode
        setTimeout(() => {
            // Return to attract mode (Requirement 3.2.5)
            setAttractMode(true);
        }, 100);
    }, [resetSession, setAttractMode]);

    // Extend session by resetting last interaction time
    const extendSession = useCallback(() => {
        console.log('⏰ Session extended by user');
        updateInteraction();
        setShowWarning(false);
        setCountdown(0);
    }, [updateInteraction]);

    // Main inactivity check effect
    useEffect(() => {
        if (!isPlaying) return; // Only check during active gameplay

        const checkInactivity = () => {
            const timeSinceInteraction = getTimeSinceLastInteraction();
            const timeUntilWarning = KIOSK_CONFIG.INACTIVITY_TIMEOUT - timeSinceInteraction;
            const timeUntilAutoReset = KIOSK_CONFIG.INACTIVITY_TIMEOUT + KIOSK_CONFIG.WARNING_DURATION - timeSinceInteraction;

            setTimeUntilReset(Math.max(0, timeUntilAutoReset));

            // Show warning 30 seconds before reset
            if (timeSinceInteraction >= KIOSK_CONFIG.INACTIVITY_TIMEOUT && !showWarning) {
                console.log('⚠️ Showing inactivity warning');
                setShowWarning(true);
                setCountdown(KIOSK_CONFIG.WARNING_DURATION / 1000); // Convert to seconds
            }

            // Auto-reset after warning period expires
            if (timeSinceInteraction >= KIOSK_CONFIG.INACTIVITY_TIMEOUT + KIOSK_CONFIG.WARNING_DURATION) {
                handleReset();
            }
        };

        const interval = setInterval(checkInactivity, 1000); // Check every second
        return () => clearInterval(interval);
    }, [isPlaying, getTimeSinceLastInteraction, showWarning, handleReset]);

    // Countdown effect for warning
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

    // Don't render anything if warning is not shown
    if (!showWarning) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="w-96 mx-4 bg-white dark:bg-gray-800 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-red-600 dark:text-red-400">
                        {t('common.autoReset.warning.title') || 'Session Timeout Warning'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div className="text-6xl font-bold text-red-500 mb-4">
                        {countdown}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">
                        {t('common.autoReset.warning.message') ||
                            'Your session will reset automatically due to inactivity. All progress will be lost.'}
                    </p>

                    <div className="space-y-2">
                        <Button
                            onClick={extendSession}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            size="lg"
                        >
                            {t('common.autoReset.warning.continueButton') || 'Continue Playing'}
                        </Button>

                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="w-full"
                            size="lg"
                        >
                            {t('common.autoReset.warning.resetButton') || 'Reset Now'}
                        </Button>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('common.autoReset.warning.extendInfo') ||
                            'Clicking "Continue Playing" will extend your session by 10 minutes.'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}