import { GameCanvas } from '@/features/scene';
import { useStore } from '@/state/store';
import { getFarmStats } from '@/features/farm/farm.service';
import { VirtualJoystick } from '@/features/input';
import { ToolFeedback, ToolSelector, SeedSelector } from '@/features/tools';
import { HeritageCodex } from '@/features/codex';
import { useCodexUnlockTracking } from '@/features/codex/useCodexUnlockTracking';
import { Shop } from '@/features/shop';
import Goals from '@/features/goals/Goals.module';
import { useGoalIntegration, GoalCompletionNotification } from '@/features/goals';
import EducationalModal from '@/features/education/EducationalModal.module';
import { DayTransition } from '@/features/time';
import { DaySummary } from '@/features/summary';
import { NPCDialogue } from '@/features/npc';
import { useQuestIntegration, QuestCompletionNotification } from '@/features/quests';
import { useAudio } from '@/features/audio/hooks/useAudio';
import { SettingsModal } from '@/features/settings';
import AudioToggle from '@/features/audio/components/AudioToggle';
import { AttractMode, useInactivityDetection, AutoReset } from '@/features/kiosk';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Heritage Harvest Game Component
 * 
 * Main game container that combines:
 * - R3F Canvas (3D rendering)
 * - UI Overlays (HUD, inventory, modals)
 * - Game state management
 */
function HeritageHarvestGame() {
    const isPlaying = useStore((s) => s.game.isPlaying);
    const attractMode = useStore((s) => s.game.attractMode);
    const setAttractMode = useStore((s) => s.game.setAttractMode);
    const currentDay = useStore((s) => s.game.currentDay);
    const timeOfDay = useStore((s) => s.game.timeOfDay); // Add this to trigger re-render
    const modalOpen = useStore((s) => s.ui.modalOpen);
    const tiles = useStore((s) => s.farm.tiles);
    const coins = useStore((s) => s.inventory.coins);
    const seeds = useStore((s) => s.inventory.seeds);
    const harvested = useStore((s) => s.inventory.harvested);
    const setTool = useStore((s) => s.ui.setTool);
    const selectedTool = useStore((s) => s.ui.selectedTool);

    // Track loading state
    const [isLoading, setIsLoading] = useState(true);

    // Quest integration - automatically tracks progress and shows completion notifications
    const { completedQuest, clearCompletedQuest } = useQuestIntegration();

    // Goal integration - automatically tracks progress and shows completion notifications
    const { completedGoal, clearCompletedGoal } = useGoalIntegration();

    // Codex unlock tracking - automatically tracks and persists unlocked entries
    useCodexUnlockTracking();

    // Audio integration - manages background music and sound effects
    const { initialize: initializeAudio } = useAudio();

    // Inactivity detection for attract mode (only when game is playing)
    const { isInactive, resetTimer } = useInactivityDetection({
        enabled: isPlaying && !modalOpen && !attractMode,
        timeout: 60000, // 1 minute of inactivity
        onInactive: () => {
            setAttractMode(true);
        },
    });

    // Handle exiting attract mode
    const handleExitAttractMode = () => {
        // Exit attract mode first
        setAttractMode(false);

        // Then start the game (this will set isPlaying to true)
        useStore.getState().game.startGame();

        // Reset the inactivity timer
        resetTimer();

        // Start a new session when exiting attract mode (requirement 3.1.5)
        useStore.getState().session.startSession();
    };

    // Initialize audio on first user interaction
    useEffect(() => {
        const handleFirstInteraction = () => {
            initializeAudio();
            // Remove listeners after first interaction
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, [initializeAudio]);

    // ESC key handler to deselect tools
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedTool !== 'none') {
                setTool('none');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setTool, selectedTool]);

    // Get farm statistics
    const farmStats = getFarmStats(tiles);

    // Calculate 24-hour time - Use real Manila time (UTC+8)
    const now = new Date();
    const manilaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const hours = manilaTime.getHours();
    const minutes = manilaTime.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Determine if day or night (for sun/moon icon)
    const isDaytime = hours >= 6 && hours < 18; // 6 AM to 6 PM is day
    const timeIcon = isDaytime ? '☀️' : '🌙';

    // Show attract mode if active
    if (attractMode) {
        return (
            <AnimatePresence>
                <AttractMode onExit={handleExitAttractMode} />
            </AnimatePresence>
        );
    }

    if (!isPlaying) {
        return (
            <div
                className="relative w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/start-page/background.png)' }}
            >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(46,30,20,0.7), rgba(46,30,20,0.3), rgba(46,30,20,0.75))' }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center flex flex-col items-center gap-6"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                            className="space-y-2"
                        >
                            <h1
                                className="text-5xl md:text-6xl font-extrabold tracking-tight whitespace-nowrap"
                                style={{ color: '#e8d5b0', textShadow: '0 3px 16px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.6)' }}
                            >
                                🌾 Heritage Harvest
                            </h1>
                            <p
                                className="text-xl md:text-2xl font-semibold italic tracking-wide"
                                style={{ color: '#c4a06a', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
                            >
                                Museum Farming Experience
                            </p>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-base max-w-md mx-auto"
                            style={{ color: 'rgba(232,213,176,0.8)', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                        >
                            Learn about sustainable farming practices while growing your own virtual farm
                        </motion.p>

                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, type: "spring", stiffness: 180, damping: 14 }}
                            className="relative"
                        >
                            <motion.div
                                className="absolute -inset-2 rounded-2xl blur-lg"
                                style={{ backgroundColor: 'rgba(176,144,96,0.2)' }}
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => useStore.getState().game.startGame()}
                                className="relative px-10 py-5 rounded-2xl text-2xl font-bold transition-all duration-200 cursor-pointer border-2"
                                style={{
                                    background: 'linear-gradient(to bottom, #5a4030, #3a2515)',
                                    borderColor: '#b09060',
                                    color: '#e8d5b0',
                                    boxShadow: '0 6px 24px rgba(46,30,20,0.6)',
                                }}
                            >
                                Start Farming
                            </motion.button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="flex gap-3 md:gap-4 justify-center mt-2"
                        >
                            {[
                                { icon: '🌱', label: 'Plant Crops' },
                                { icon: '💧', label: 'Water Daily' },
                                { icon: '🌾', label: 'Harvest & Earn' },
                            ].map((card, i) => (
                                <motion.div
                                    key={card.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className="backdrop-blur-md rounded-xl px-5 py-3 border-2"
                                    style={{ backgroundColor: 'rgba(58,37,24,0.7)', borderColor: 'rgba(176,144,96,0.3)' }}
                                >
                                    <p className="text-2xl mb-1">{card.icon}</p>
                                    <p className="font-semibold text-sm" style={{ color: '#e8d5b0' }}>{card.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                <EducationalModal />
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden" style={{ background: 'linear-gradient(to bottom, #3a2518, #2e1e14, #241610)' }}>
            <GameCanvas onLoadingComplete={() => setIsLoading(false)} />

            {/* Only show UI elements after loading is complete */}
            {!isLoading && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="pointer-events-auto">
                        <VirtualJoystick />
                        <ToolSelector />
                        <SeedSelector />
                        <ToolFeedback />

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-2 left-2 sm:top-4 sm:left-4 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-5 sm:py-4 space-y-1 sm:space-y-2 shadow-2xl border-2 max-w-[180px] sm:max-w-none"
                            style={{ backgroundColor: 'rgba(58, 37, 24, 0.95)', borderColor: '#b09060', maxHeight: 'calc(100vh - 16px)', overflowY: 'auto' }}
                        >
                            <div className="flex items-center gap-2 pb-1 sm:pb-2 border-b" style={{ borderColor: 'rgba(176, 144, 96, 0.4)' }}>
                                <div className="flex-1">
                                    <p className="text-base sm:text-xl font-bold" style={{ color: '#e8d5b0' }}>Day {currentDay}</p>
                                    <p className="text-xs sm:text-sm" style={{ color: '#b09060' }}>💰 {coins} Coins</p>
                                    <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1" style={{ color: '#8a7050' }}>
                                        {timeIcon} {timeString}
                                    </p>
                                    <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-semibold" style={{ color: '#c4a06a' }}>
                                        🎒 Seeds: {useStore.getState().inventory.getSeedsInventoryCount()}/{useStore.getState().inventory.upgrades.inventorySize}
                                    </p>

                                    <p className="text-[10px] sm:text-xs font-semibold mt-1 sm:mt-2" style={{ color: '#c4a06a' }}>
                                        {timeOfDay < 0.25 ? '🌅 Morning' :
                                            timeOfDay < 0.5 ? '☀️ Midday' :
                                                timeOfDay < 0.75 ? '🌤️ Afternoon' :
                                                    '🌆 Evening'}
                                    </p>

                                    <div className="mt-1 sm:mt-2">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <div className="flex-1 h-1.5 sm:h-2 rounded-full overflow-hidden border" style={{ backgroundColor: 'rgba(30, 18, 10, 0.6)', borderColor: 'rgba(176, 144, 96, 0.3)' }}>
                                                <div
                                                    className="h-full transition-all duration-300"
                                                    style={{ width: `${(timeOfDay * 100).toFixed(1)}%`, background: 'linear-gradient(to right, #b09060, #c4a06a)' }}
                                                />
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-mono min-w-[2rem] sm:min-w-[3rem]" style={{ color: '#b09060' }}>
                                                {(timeOfDay * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[10px] sm:text-xs space-y-1">
                                <p className="font-semibold mb-0.5 sm:mb-1" style={{ color: '#c4a06a' }}>🌱 Seeds:</p>
                                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                    <div className="rounded px-1.5 py-0.5 sm:px-2 sm:py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                        <span>🫘</span> {seeds.bean}
                                    </div>
                                    <div className="rounded px-1.5 py-0.5 sm:px-2 sm:py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                        <span>🌾</span> {seeds.wheat}
                                    </div>
                                    <div className="rounded px-1.5 py-0.5 sm:px-2 sm:py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                        <span>🍅</span> {seeds.tomato}
                                    </div>
                                    <div className="rounded px-1.5 py-0.5 sm:px-2 sm:py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                        <span>🥕</span> {seeds.carrot}
                                    </div>
                                </div>
                            </div>

                            {/* Harvested Items - Always show eggs */}
                            <div className="text-[10px] sm:text-xs space-y-1 pt-1 sm:pt-2 border-t" style={{ borderColor: 'rgba(176, 144, 96, 0.4)' }}>
                                <p className="font-semibold mb-0.5 sm:mb-1" style={{ color: '#c4a06a' }}>🥚 Inventory:</p>
                                <div className="rounded px-1.5 py-0.5 sm:px-2 sm:py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                    <span>🥚</span> Eggs: {harvested.egg}
                                </div>
                            </div>

                            <div className="text-[10px] sm:text-xs space-y-0.5 sm:space-y-1 pt-1 sm:pt-2 border-t" style={{ borderColor: 'rgba(176, 144, 96, 0.4)' }}>
                                <p className="font-semibold" style={{ color: '#c4a06a' }}>📊 Farm:</p>
                                <div className="space-y-0.5" style={{ color: '#e8d5b0' }}>
                                    <p>🟫 Untilled: {farmStats.untilled}</p>
                                    <p>🟤 Tilled: {farmStats.tilled}</p>
                                    <p>🌱 Planted: {farmStats.planted}</p>
                                    <p>✨ Ready: {farmStats.ready}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => useStore.getState().ui.openGameModal('codex', null)}
                                className="w-full mt-1 sm:mt-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 border-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                style={{ background: 'linear-gradient(to right, #4a3020, #3a2515)', borderColor: '#b09060', color: '#e8d5b0' }}
                            >
                                <span className="text-sm sm:text-lg">📚</span>
                                <span>Codex</span>
                            </button>

                            <button
                                onClick={() => useStore.getState().ui.openGameModal('shop', null)}
                                className="w-full mt-1 sm:mt-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 border-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                style={{ background: 'linear-gradient(to right, #4a3020, #3a2515)', borderColor: '#b09060', color: '#e8d5b0' }}
                            >
                                <span className="text-sm sm:text-lg">🏪</span>
                                <span>Shop</span>
                            </button>

                            <button
                                onClick={() => useStore.getState().ui.openGameModal('goals', null)}
                                className="w-full mt-1 sm:mt-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 border-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                style={{ background: 'linear-gradient(to right, #4a3020, #3a2515)', borderColor: '#b09060', color: '#e8d5b0' }}
                            >
                                <span className="text-sm sm:text-lg">🏆</span>
                                <span>Goals</span>
                            </button>

                            {/* Audio Toggle */}
                            <div className="mt-1 sm:mt-2">
                                <AudioToggle
                                    className="w-full px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 border-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                    style={{ background: 'linear-gradient(to right, #4a3020, #3a2515)', borderColor: '#b09060', color: '#e8d5b0' }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            <EducationalModal />
            <HeritageCodex />
            <SettingsModal />
            {modalOpen === 'shop' && <Shop />}
            {modalOpen === 'goals' && <Goals />}
            {modalOpen === 'day-summary' && <DaySummary />}

            {/* Auto-reset system - shows warning modal when inactivity detected */}
            <AutoReset />

            {/* Only show NPC dialogue after loading */}
            {!isLoading && <NPCDialogue />}

            <DayTransition />

            {/* Quest Completion Notification */}
            {completedQuest && (
                <QuestCompletionNotification
                    quest={completedQuest}
                    onClose={clearCompletedQuest}
                />
            )}

            {/* Goal Completion Notification */}
            {completedGoal && (
                <GoalCompletionNotification
                    goal={completedGoal}
                    onClose={clearCompletedGoal}
                />
            )}
        </div>
    );
}

export default HeritageHarvestGame;