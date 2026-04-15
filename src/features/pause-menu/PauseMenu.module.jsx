/**
 * PauseMenu Module
 * Main pause menu modal with Resume, How to Play, Reset Farm, and Admin options
 * Requirements: 1.2, 1.5, 1.6, 2.1, 2.2, 2.3, 6.1, 6.3, 6.5, 6.6, 10.1, 10.2, 10.3, 10.4, 10.5, 10.7
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/state/store';
import { PAUSE_MENU_CONFIG } from './pause-menu.config';
import { Play, BookOpen, RotateCcw, Settings } from 'lucide-react';
import HowToPlay from './components/HowToPlay';
import ResetConfirmation from './components/ResetConfirmation';

export default function PauseMenu() {
    const isOpen = useStore((s) => s.pauseMenu.isOpen);
    const currentScreen = useStore((s) => s.pauseMenu.currentScreen);
    const closePauseMenu = useStore((s) => s.pauseMenu.close);
    const setScreen = useStore((s) => s.pauseMenu.setScreen);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationDuration = prefersReducedMotion
        ? PAUSE_MENU_CONFIG.accessibility.reducedMotionDuration
        : PAUSE_MENU_CONFIG.animations.modalTransition;

    // Handle ESC key to close menu (Requirement 2.6)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closePauseMenu();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closePauseMenu]);

    // Focus management (Requirement 8.1, 8.2, 8.7)
    useEffect(() => {
        if (isOpen && currentScreen === 'main') {
            // Focus first button when menu opens
            setTimeout(() => {
                const firstButton = document.querySelector('[data-pause-menu-button="resume"]');
                if (firstButton) {
                    firstButton.focus();
                }
            }, 100); // Small delay to ensure modal is rendered
        }
    }, [isOpen, currentScreen]);

    // Handle clicking outside modal to close (Requirement 2.7)
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && currentScreen === 'main') {
            closePauseMenu();
        }
    };

    // Handle Resume button
    const handleResume = () => {
        closePauseMenu();
    };

    // Handle How to Play button
    const handleHowToPlay = () => {
        setScreen('howToPlay');
    };

    // Handle Reset Farm button
    const handleResetFarm = () => {
        setScreen('resetConfirm');
    };

    // Handle Admin button
    const handleAdmin = () => {
        // Trigger admin panel open event
        // The admin panel is managed by App.jsx via useAdminPanel hook
        // We'll dispatch a custom event that the hook can listen for
        window.dispatchEvent(new CustomEvent('openAdminPanel'));
    };

    if (!isOpen) return null;

    // Show sub-screens
    if (currentScreen === 'howToPlay') {
        return <HowToPlay />;
    }

    if (currentScreen === 'resetConfirm') {
        return <ResetConfirmation />;
    }

    // Main pause menu screen
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: animationDuration / 1000 }}
                className="fixed inset-0 flex items-center justify-center"
                style={{
                    backgroundColor: PAUSE_MENU_CONFIG.colors.overlay,
                    zIndex: PAUSE_MENU_CONFIG.zIndex.pauseMenu,
                }}
                onClick={handleOverlayClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="pause-menu-title"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: animationDuration / 1000 }}
                    className="rounded-xl border-2 shadow-2xl"
                    style={{
                        width: PAUSE_MENU_CONFIG.modal.width.tablet,
                        maxWidth: '90%',
                        maxHeight: PAUSE_MENU_CONFIG.modal.maxHeight,
                        padding: `${PAUSE_MENU_CONFIG.spacing.contentPadding.tablet}px`,
                        background: PAUSE_MENU_CONFIG.colors.modalBg,
                        borderColor: PAUSE_MENU_CONFIG.colors.border,
                        borderRadius: `${PAUSE_MENU_CONFIG.modal.borderRadius}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Title */}
                    <h2
                        id="pause-menu-title"
                        className="text-center font-bold mb-8"
                        style={{
                            fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.heading.tablet}px`,
                            color: PAUSE_MENU_CONFIG.colors.text,
                        }}
                    >
                        🌾 Pause Menu
                    </h2>

                    {/* Buttons */}
                    <div
                        className="flex flex-col"
                        style={{ gap: `${PAUSE_MENU_CONFIG.spacing.buttonGap}px` }}
                    >
                        {/* Resume Button */}
                        <MenuButton
                            onClick={handleResume}
                            icon={<Play className="w-6 h-6" />}
                            label="Resume"
                            variant="primary"
                            ariaLabel="Resume game"
                            dataId="resume"
                        />

                        {/* How to Play Button */}
                        <MenuButton
                            onClick={handleHowToPlay}
                            icon={<BookOpen className="w-6 h-6" />}
                            label="How to Play"
                            variant="secondary"
                            ariaLabel="View game instructions"
                            dataId="howToPlay"
                        />

                        {/* Reset Farm Button */}
                        <MenuButton
                            onClick={handleResetFarm}
                            icon={<RotateCcw className="w-6 h-6" />}
                            label="Reset Farm"
                            variant="warning"
                            ariaLabel="Reset farm progress"
                            dataId="reset"
                        />

                        {/* Admin Button */}
                        <MenuButton
                            onClick={handleAdmin}
                            icon={<Settings className="w-6 h-6" />}
                            label="Admin"
                            variant="subtle"
                            ariaLabel="Open admin panel"
                            dataId="admin"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * MenuButton Component
 * Reusable button for pause menu actions
 */
function MenuButton({ onClick, icon, label, variant, ariaLabel, dataId }) {
    const colors = PAUSE_MENU_CONFIG.colors[variant];

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full rounded-lg border-2 font-semibold transition-all duration-150 flex items-center justify-center gap-3 focus:outline-none focus:ring-4"
            style={{
                height: `${PAUSE_MENU_CONFIG.buttonHeight.tablet}px`,
                background: colors.bg,
                borderColor: colors.border,
                color: colors.text,
                fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.button.tablet}px`,
                outlineOffset: `${PAUSE_MENU_CONFIG.accessibility.focusOutlineOffset}px`,
            }}
            aria-label={ariaLabel}
            data-pause-menu-button={dataId}
        >
            {icon}
            <span>{label}</span>
        </motion.button>
    );
}
