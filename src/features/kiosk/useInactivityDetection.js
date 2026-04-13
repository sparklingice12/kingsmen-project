import { useState, useEffect, useCallback, useRef } from 'react';
import { KIOSK_CONFIG } from './kiosk.config';

/**
 * Inactivity Detection Hook
 * 
 * Tracks user inactivity and triggers callbacks when thresholds are reached.
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Inactivity timeout in milliseconds
 * @param {Function} options.onInactive - Callback when timeout is reached
 * @param {boolean} options.enabled - Whether detection is enabled
 * @returns {Object} - { isInactive, resetTimer, timeRemaining }
 */
export function useInactivityDetection({
    timeout = KIOSK_CONFIG.ATTRACT_MODE_DELAY,
    onInactive,
    enabled = true,
} = {}) {
    const [isInactive, setIsInactive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(timeout);
    const timerRef = useRef(null);
    const countdownRef = useRef(null);
    const lastActivityRef = useRef(Date.now());

    // Reset the inactivity timer
    const resetTimer = useCallback(() => {
        if (!enabled) return;

        setIsInactive(false);
        lastActivityRef.current = Date.now();
        setTimeRemaining(timeout);

        // Clear existing timers
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
        }

        // Start countdown interval
        countdownRef.current = setInterval(() => {
            const elapsed = Date.now() - lastActivityRef.current;
            const remaining = Math.max(0, timeout - elapsed);
            setTimeRemaining(remaining);

            if (remaining === 0) {
                clearInterval(countdownRef.current);
            }
        }, 1000);

        // Set timeout for inactivity
        timerRef.current = setTimeout(() => {
            setIsInactive(true);
            if (onInactive) {
                onInactive();
            }
        }, timeout);
    }, [timeout, onInactive, enabled]);

    // Track user activity
    useEffect(() => {
        if (!enabled) {
            setIsInactive(false);
            return;
        }

        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click',
        ];

        // Reset timer on any user activity
        const handleActivity = () => {
            resetTimer();
        };

        // Add event listeners
        events.forEach((event) => {
            document.addEventListener(event, handleActivity);
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, handleActivity);
            });
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, [enabled, resetTimer]);

    return {
        isInactive,
        resetTimer,
        timeRemaining,
    };
}
