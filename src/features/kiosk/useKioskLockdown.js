import { useEffect } from 'react';

/**
 * useKioskLockdown Hook
 * 
 * Implements kiosk security features to prevent users from exiting the application.
 * 
 * Features:
 * - Disables right-click context menu
 * - Blocks browser back button
 * - Disables common keyboard shortcuts (F11, F5, Ctrl+R, etc.)
 * - Prevents text selection
 * 
 * Requirements: Tasks 53.2, 53.3
 */
export function useKioskLockdown({ enabled = true } = {}) {
    useEffect(() => {
        if (!enabled) return;

        // Disable right-click context menu
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable browser back button
        const handlePopState = (e) => {
            // Push a new state to prevent back navigation
            window.history.pushState(null, '', window.location.href);
        };

        // Disable keyboard shortcuts
        const handleKeyDown = (e) => {
            // F11 (fullscreen toggle)
            if (e.key === 'F11') {
                e.preventDefault();
                return false;
            }

            // F5 or Ctrl+R (refresh)
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                e.preventDefault();
                return false;
            }

            // Ctrl+W (close tab)
            if (e.ctrlKey && e.key === 'w') {
                e.preventDefault();
                return false;
            }

            // Alt+F4 (close window) - can't fully prevent, but we can try
            if (e.altKey && e.key === 'F4') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }

            // F12 (DevTools)
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                return false;
            }
        };

        // Prevent text selection via drag
        const handleSelectStart = (e) => {
            e.preventDefault();
            return false;
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectstart', handleSelectStart);

        // Initialize history state to prevent back button
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectstart', handleSelectStart);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [enabled]);

    return {
        enabled,
    };
}
