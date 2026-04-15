import { useEffect, useState } from 'react';

/**
 * useFullscreen Hook
 * 
 * Manages fullscreen mode for kiosk deployment.
 * Automatically enters fullscreen on mount and provides controls.
 * 
 * Requirements: Task 53.1
 */
export function useFullscreen({ autoEnter = true, exitOnEscape = false } = {}) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Check if fullscreen is supported
    const isSupported = !!(
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
    );

    // Enter fullscreen
    const enterFullscreen = async () => {
        if (!isSupported) {
            console.warn('Fullscreen API not supported');
            return false;
        }

        try {
            const element = document.documentElement;

            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }

            return true;
        } catch (error) {
            console.error('Failed to enter fullscreen:', error);
            return false;
        }
    };

    // Exit fullscreen
    const exitFullscreen = async () => {
        if (!isSupported) return false;

        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }

            return true;
        } catch (error) {
            console.error('Failed to exit fullscreen:', error);
            return false;
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = async () => {
        if (isFullscreen) {
            return await exitFullscreen();
        } else {
            return await enterFullscreen();
        }
    };

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );

            setIsFullscreen(isCurrentlyFullscreen);
        };

        // Add event listeners for all browsers
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    // Auto-enter fullscreen on mount
    useEffect(() => {
        if (autoEnter && isSupported && !isFullscreen) {
            // Delay to ensure user interaction has occurred
            const timer = setTimeout(() => {
                enterFullscreen();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [autoEnter, isSupported]);

    // Handle escape key
    useEffect(() => {
        if (!exitOnEscape) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                e.preventDefault();
                // Re-enter fullscreen after a brief delay
                setTimeout(() => {
                    enterFullscreen();
                }, 100);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [exitOnEscape, isFullscreen]);

    return {
        isFullscreen,
        isSupported,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
    };
}
