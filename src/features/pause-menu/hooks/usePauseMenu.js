/**
 * usePauseMenu Hook
 * Business logic for pause menu interactions
 * Requirements: 1.2, 2.1, 3.1, 4.7, 5.1
 */

import { useStore } from '@/state/store';

export function usePauseMenu() {
    // Get state from store
    const isOpen = useStore((s) => s.pauseMenu.isOpen);
    const currentScreen = useStore((s) => s.pauseMenu.currentScreen);
    const isPaused = useStore((s) => s.game.isPaused);

    // Get actions from store
    const open = useStore((s) => s.pauseMenu.open);
    const close = useStore((s) => s.pauseMenu.close);
    const setScreen = useStore((s) => s.pauseMenu.setScreen);
    const resetSession = useStore((s) => s.session.resetSession);

    // Helper: Open How to Play screen
    const openHowToPlay = () => {
        setScreen('howToPlay');
    };

    // Helper: Open Reset Confirmation screen
    const openResetConfirm = () => {
        setScreen('resetConfirm');
    };

    // Helper: Back to main pause menu
    const backToMain = () => {
        setScreen('main');
    };

    // Helper: Handle reset (with error handling)
    const handleReset = () => {
        try {
            resetSession();
            close();

            // Show success feedback
            useStore.getState().ui.setFeedback({
                success: true,
                message: 'Farm reset successfully!',
                timestamp: Date.now(),
            });

            return { success: true };
        } catch (error) {
            console.error('Reset failed:', error);

            // Show error feedback
            useStore.getState().ui.setFeedback({
                success: false,
                message: 'Failed to reset farm. Please try again.',
                timestamp: Date.now(),
            });

            return { success: false, error };
        }
    };

    // Helper: Handle admin access
    const handleAdminAccess = () => {
        try {
            // Open admin panel via UI modal system
            const openModal = useStore.getState().ui.openModal;
            if (openModal) {
                openModal('admin');
                return { success: true };
            }

            throw new Error('Admin panel not available');
        } catch (error) {
            console.error('Failed to open admin panel:', error);

            // Show error feedback
            useStore.getState().ui.setFeedback({
                success: false,
                message: 'Failed to open admin panel.',
                timestamp: Date.now(),
            });

            return { success: false, error };
        }
    };

    return {
        // State
        isOpen,
        currentScreen,
        isPaused,

        // Actions
        open,
        close,
        setScreen,

        // Helpers
        openHowToPlay,
        openResetConfirm,
        backToMain,
        handleReset,
        handleAdminAccess,
    };
}
