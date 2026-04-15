import { useState, useEffect } from 'react';

/**
 * Hook for managing admin panel access
 * Listens for Ctrl+Shift+A keyboard combination to open admin panel
 */
export function useAdminPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [keySequence, setKeySequence] = useState([]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Admin panel shortcut: Ctrl+Shift+A
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                setIsOpen(true);
                return;
            }

            // Alternative: Triple-click on corners (for touch devices)
            // This will be handled by a separate touch handler
        };

        // Listen for custom event from pause menu
        const handleOpenAdminPanel = () => {
            setIsOpen(true);
        };

        // Add global store reference for admin panel access
        if (typeof window !== 'undefined') {
            window.__HERITAGE_HARVEST_STORE__ = {
                getState: () => {
                    // Import store dynamically to avoid circular dependencies
                    const { useStore } = require('@/state/store');
                    return {
                        resetSession: useStore.getState().session.resetSession,
                        setAttractMode: useStore.getState().game.setAttractMode,
                    };
                }
            };
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('openAdminPanel', handleOpenAdminPanel);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('openAdminPanel', handleOpenAdminPanel);
            if (typeof window !== 'undefined') {
                delete window.__HERITAGE_HARVEST_STORE__;
            }
        };
    }, []);

    const closePanel = () => setIsOpen(false);

    return {
        isOpen,
        closePanel,
    };
}