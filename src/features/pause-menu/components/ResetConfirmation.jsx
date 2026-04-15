/**
 * ResetConfirmation Component
 * Confirmation dialog for resetting the farm
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12
 */

import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { PAUSE_MENU_CONFIG } from '../pause-menu.config';
import { AlertTriangle } from 'lucide-react';

export default function ResetConfirmation({ onCancel, onConfirm }) {
    const setScreen = useStore((s) => s.pauseMenu.setScreen);
    const closePauseMenu = useStore((s) => s.pauseMenu.close);
    const resetSession = useStore((s) => s.session.resetSession);

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            setScreen('main');
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            try {
                // Reset the session (preserves analytics)
                resetSession();

                // Close pause menu
                closePauseMenu();

                // Show success feedback
                useStore.getState().ui.setFeedback({
                    success: true,
                    message: 'Farm reset successfully!',
                    timestamp: Date.now(),
                });
            } catch (error) {
                console.error('Reset failed:', error);

                // Show error feedback
                useStore.getState().ui.setFeedback({
                    success: false,
                    message: 'Failed to reset farm. Please try again.',
                    timestamp: Date.now(),
                });

                // Return to main pause menu on error
                setScreen('main');
            }
        }
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationDuration = prefersReducedMotion
        ? PAUSE_MENU_CONFIG.accessibility.reducedMotionDuration
        : PAUSE_MENU_CONFIG.animations.modalTransition;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration / 1000 }}
            className="fixed inset-0 flex items-center justify-center"
            style={{
                backgroundColor: PAUSE_MENU_CONFIG.colors.overlay,
                zIndex: PAUSE_MENU_CONFIG.zIndex.resetConfirmation,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-confirmation-title"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: animationDuration / 1000 }}
                className="rounded-xl border-2 shadow-2xl"
                style={{
                    width: 500,
                    maxWidth: '90%',
                    padding: `${PAUSE_MENU_CONFIG.spacing.contentPadding.tablet}px`,
                    background: PAUSE_MENU_CONFIG.colors.modalBg,
                    borderColor: PAUSE_MENU_CONFIG.colors.warning.border,
                    borderRadius: `${PAUSE_MENU_CONFIG.modal.borderRadius}px`,
                }}
            >
                {/* Warning Icon and Title */}
                <div className="flex flex-col items-center mb-6">
                    <AlertTriangle
                        className="w-16 h-16 mb-4"
                        style={{ color: PAUSE_MENU_CONFIG.colors.warning.border }}
                    />
                    <h2
                        id="reset-confirmation-title"
                        className="text-center font-bold"
                        style={{
                            fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.heading.tablet}px`,
                            color: PAUSE_MENU_CONFIG.colors.text,
                        }}
                    >
                        Reset Farm?
                    </h2>
                </div>

                {/* Warning Message */}
                <div
                    className="mb-6 text-center"
                    style={{
                        fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.body.tablet}px`,
                        color: PAUSE_MENU_CONFIG.colors.text,
                        lineHeight: PAUSE_MENU_CONFIG.typography.lineHeight,
                    }}
                >
                    <p className="mb-4">
                        Are you sure you want to reset your farm? <strong>All progress will be lost:</strong>
                    </p>

                    <ul className="text-left space-y-2 mb-4">
                        <li>🟫 All farm tiles will be untilled</li>
                        <li>💰 Coins will reset to 0</li>
                        <li>🌱 Seeds will reset to starting amounts</li>
                        <li>📦 Harvested items will be cleared</li>
                        <li>📅 Day counter will reset to Day 1</li>
                    </ul>

                    <p
                        className="text-sm"
                        style={{ color: PAUSE_MENU_CONFIG.colors.textMuted }}
                    >
                        Note: Your session analytics will be saved for museum records.
                    </p>
                </div>

                {/* Buttons */}
                <div
                    className="flex gap-4"
                >
                    {/* Cancel Button */}
                    <motion.button
                        onClick={handleCancel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 rounded-lg border-2 font-semibold transition-all duration-150"
                        style={{
                            height: `${PAUSE_MENU_CONFIG.buttonHeight.tablet}px`,
                            background: PAUSE_MENU_CONFIG.colors.secondary.bg,
                            borderColor: PAUSE_MENU_CONFIG.colors.border,
                            color: PAUSE_MENU_CONFIG.colors.text,
                            fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.button.tablet}px`,
                        }}
                        aria-label="Cancel reset"
                    >
                        Cancel
                    </motion.button>

                    {/* Confirm Reset Button */}
                    <motion.button
                        onClick={handleConfirm}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 rounded-lg border-2 font-semibold transition-all duration-150"
                        style={{
                            height: `${PAUSE_MENU_CONFIG.buttonHeight.tablet}px`,
                            background: PAUSE_MENU_CONFIG.colors.warning.bg,
                            borderColor: PAUSE_MENU_CONFIG.colors.warning.border,
                            color: PAUSE_MENU_CONFIG.colors.text,
                            fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.button.tablet}px`,
                        }}
                        aria-label="Confirm reset farm"
                    >
                        Confirm Reset
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
