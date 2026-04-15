/**
 * HowToPlay Component
 * Instructions screen explaining game mechanics and controls
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10
 */

import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { PAUSE_MENU_CONFIG } from '../pause-menu.config';
import { ArrowLeft } from 'lucide-react';

export default function HowToPlay({ onBack }) {
    const setScreen = useStore((s) => s.pauseMenu.setScreen);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            setScreen('main');
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
                zIndex: PAUSE_MENU_CONFIG.zIndex.pauseMenu,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-to-play-title"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: animationDuration / 1000 }}
                className="rounded-xl border-2 shadow-2xl overflow-y-auto"
                style={{
                    width: 800,
                    maxWidth: '90%',
                    maxHeight: '80vh',
                    padding: `${PAUSE_MENU_CONFIG.spacing.contentPadding.tablet}px`,
                    background: PAUSE_MENU_CONFIG.colors.modalBg,
                    borderColor: PAUSE_MENU_CONFIG.colors.border,
                    borderRadius: `${PAUSE_MENU_CONFIG.modal.borderRadius}px`,
                }}
            >
                {/* Title */}
                <h2
                    id="how-to-play-title"
                    className="text-center font-bold mb-6"
                    style={{
                        fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.heading.tablet}px`,
                        color: PAUSE_MENU_CONFIG.colors.text,
                    }}
                >
                    📖 How to Play
                </h2>

                {/* Content */}
                <div
                    className="space-y-6"
                    style={{
                        fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.body.tablet}px`,
                        color: PAUSE_MENU_CONFIG.colors.text,
                        lineHeight: PAUSE_MENU_CONFIG.typography.lineHeight,
                    }}
                >
                    {/* Section: Tools & Actions */}
                    <Section title="🛠️ Tools & Actions">
                        <Tool
                            icon="🔨"
                            name="Hoe"
                            description="Till untilled soil to prepare it for planting. Tap an untilled tile with the hoe selected."
                        />
                        <Tool
                            icon="💧"
                            name="Watering Can"
                            description="Water tilled or planted tiles. Crops need water to grow. Tap a tile with the watering can selected."
                        />
                        <Tool
                            icon="🌱"
                            name="Seed Bag"
                            description="Plant seeds on watered tiles. Select a seed type, then tap a watered tile to plant."
                        />
                        <Tool
                            icon="✂️"
                            name="Harvest Tool"
                            description="Harvest fully grown crops. Tap a ready crop with the harvest tool to collect it."
                        />
                    </Section>

                    {/* Section: Crop Growth Cycle */}
                    <Section title="🌾 Crop Growth Cycle">
                        <p>Crops grow through 4 stages and need water to progress:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li><strong>Stage 1:</strong> Seedling (just planted)</li>
                            <li><strong>Stage 2:</strong> Young plant (1-2 days)</li>
                            <li><strong>Stage 3:</strong> Mature plant (2-3 days)</li>
                            <li><strong>Stage 4:</strong> Ready to harvest! ✨</li>
                        </ul>
                        <p className="mt-3">
                            <strong>Growth Times:</strong> Wheat & Carrot (3 days), Tomato & Bean (4 days)
                        </p>
                        <p className="mt-2">
                            <strong>Watering:</strong> Crops need water each day to grow. If not watered for 2 days, they may wither!
                        </p>
                    </Section>

                    {/* Section: Controls */}
                    <Section title="🎮 Controls">
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Virtual Joystick:</strong> Drag the joystick in the bottom-left to move your farmer</li>
                            <li><strong>Tool Buttons:</strong> Tap tool buttons on the left to select a tool</li>
                            <li><strong>Seed Selector:</strong> Tap seed buttons to choose which crop to plant</li>
                            <li><strong>Tap Tiles:</strong> Tap farm tiles to use your selected tool</li>
                            <li><strong>Tap Crops:</strong> Tap crops to learn farming facts</li>
                        </ul>
                    </Section>

                    {/* Section: Economy */}
                    <Section title="💰 Economy & Shop">
                        <p>Earn coins by selling harvested crops at the shop:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>🌾 Wheat: 10 coins</li>
                            <li>🥕 Carrot: 15 coins</li>
                            <li>🍅 Tomato: 20 coins</li>
                            <li>🫘 Bean: 25 coins</li>
                            <li>🥚 Egg: 30 coins (from chickens)</li>
                        </ul>
                        <p className="mt-3">
                            Use coins to buy more seeds and upgrade your tools at the shop!
                        </p>
                    </Section>
                </div>

                {/* Back Button */}
                <motion.button
                    onClick={handleBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 rounded-lg border-2 font-semibold transition-all duration-150 flex items-center justify-center gap-2 mx-auto"
                    style={{
                        width: `${PAUSE_MENU_CONFIG.touchTargets.primary * 3}px`,
                        height: `${PAUSE_MENU_CONFIG.touchTargets.primary}px`,
                        background: PAUSE_MENU_CONFIG.colors.secondary.bg,
                        borderColor: PAUSE_MENU_CONFIG.colors.border,
                        color: PAUSE_MENU_CONFIG.colors.text,
                        fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.button.tablet}px`,
                    }}
                    aria-label="Back to pause menu"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span>Back</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

/**
 * Section Component
 * Reusable section with title
 */
function Section({ title, children }) {
    return (
        <div>
            <h3
                className="font-bold mb-3"
                style={{
                    fontSize: `${PAUSE_MENU_CONFIG.typography.fontSize.heading.mobile}px`,
                    color: PAUSE_MENU_CONFIG.colors.text,
                }}
            >
                {title}
            </h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

/**
 * Tool Component
 * Displays a tool with icon, name, and description
 */
function Tool({ icon, name, description }) {
    return (
        <div className="flex gap-3 items-start">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div>
                <strong style={{ color: PAUSE_MENU_CONFIG.colors.text }}>{name}:</strong>{' '}
                <span style={{ color: PAUSE_MENU_CONFIG.colors.textMuted }}>{description}</span>
            </div>
        </div>
    );
}
