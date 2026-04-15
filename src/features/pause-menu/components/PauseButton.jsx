/**
 * PauseButton Component
 * HUD button that opens the pause menu
 * Requirements: 1.1, 1.2, 6.1, 6.2, 10.1, 10.2, 10.5
 */

import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { PAUSE_MENU_CONFIG } from '../pause-menu.config';
import { Pause } from 'lucide-react';

export default function PauseButton() {
    const openPauseMenu = useStore((s) => s.pauseMenu.open);

    const handleClick = () => {
        // Play click sound effect
        import('@/features/audio/audio.service').then(({ playSfx }) => {
            playSfx('click');
        });

        // Open pause menu
        openPauseMenu();
    };

    return (
        <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 left-4 rounded-xl border-2 shadow-lg transition-all duration-150 flex items-center justify-center"
            style={{
                width: `${PAUSE_MENU_CONFIG.touchTargets.primary}px`,
                height: `${PAUSE_MENU_CONFIG.touchTargets.primary}px`,
                background: PAUSE_MENU_CONFIG.colors.secondary.bg,
                borderColor: PAUSE_MENU_CONFIG.colors.border,
                color: PAUSE_MENU_CONFIG.colors.text,
                zIndex: PAUSE_MENU_CONFIG.zIndex.pauseButton,
            }}
            aria-label="Pause game"
            title="Pause"
        >
            <Pause className="w-8 h-8" />
        </motion.button>
    );
}
