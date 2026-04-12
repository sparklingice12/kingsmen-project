import { GameCanvas } from '@/features/scene';
import { useStore } from '@/state/store';
import { getFarmStats } from '@/features/farm/farm.service';
import { VirtualJoystick } from '@/features/input';
import { ToolFeedback, ToolSelector, SeedSelector } from '@/features/tools';
import { HeritageCodex } from '@/features/codex';
import { Shop } from '@/features/shop';
import EducationalModal from '@/features/education/EducationalModal.module';
import { DayTransition } from '@/features/time';
import { DaySummary } from '@/features/summary';
import { NPCDialogue } from '@/features/npc';
import { useQuestIntegration, QuestCompletionNotification } from '@/features/quests';
import { useAudio } from '@/features/audio/hooks/useAudio';
import { SettingsModal } from '@/features/settings';
import AudioToggle from '@/features/audio/components/AudioToggle';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

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
    const currentDay = useStore((s) => s.game.currentDay);
    const timeOfDay = useStore((s) => s.game.timeOfDay); // Add this to trigger re-render
    const modalOpen = useStore((s) => s.ui.modalOpen);
    const tiles = useStore((s) => s.farm.tiles);
    const coins = useStore((s) => s.inventory.coins);
    const seeds = useStore((s) => s.inventory.seeds);
    const harvested = useStore((s) => s.inventory.harvested);
    const setTool = useStore((s) => s.ui.setTool);
    const selectedTool = useStore((s) => s.ui.selectedTool);

    // Quest integration - automatically tracks progress and shows completion notifications
    const { completedQuest, clearCompletedQuest } = useQuestIntegration();

    // Audio integration - manages background music and sound effects
    const { initialize: initializeAudio } = useAudio();

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
            <GameCanvas />

            <div className="absolute inset-0 pointer-events-none">
                <div className="pointer-events-auto">
                    <VirtualJoystick />
                    <ToolSelector />
                    <SeedSelector />
                    <ToolFeedback />

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 left-4 backdrop-blur-sm rounded-xl px-5 py-4 space-y-2 shadow-2xl border-2"
                        style={{ backgroundColor: 'rgba(58, 37, 24, 0.95)', borderColor: '#b09060' }}
                    >
                        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'rgba(176, 144, 96, 0.4)' }}>
                            <div className="flex-1">
                                <p className="text-xl font-bold" style={{ color: '#e8d5b0' }}>Day {currentDay}</p>
                                <p className="text-sm" style={{ color: '#b09060' }}>💰 {coins} Coins</p>
                                <p className="text-xs mt-1" style={{ color: '#8a7050' }}>
                                    {timeIcon} {timeString}
                                </p>

                                <p className="text-xs font-semibold mt-2" style={{ color: '#c4a06a' }}>
                                    {timeOfDay < 0.25 ? '🌅 Morning' :
                                        timeOfDay < 0.5 ? '☀️ Midday' :
                                            timeOfDay < 0.75 ? '🌤️ Afternoon' :
                                                '🌆 Evening'}
                                </p>

                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 rounded-full overflow-hidden border" style={{ backgroundColor: 'rgba(30, 18, 10, 0.6)', borderColor: 'rgba(176, 144, 96, 0.3)' }}>
                                            <div
                                                className="h-full transition-all duration-300"
                                                style={{ width: `${(timeOfDay * 100).toFixed(1)}%`, background: 'linear-gradient(to right, #b09060, #c4a06a)' }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono min-w-[3rem]" style={{ color: '#b09060' }}>
                                            {(timeOfDay * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs space-y-1">
                            <p className="font-semibold mb-1" style={{ color: '#c4a06a' }}>🌱 Seeds Available:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded px-2 py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                    <span>🫘</span> {seeds.bean}
                                </div>
                                <div className="rounded px-2 py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                    <span>🌾</span> {seeds.wheat}
                                </div>
                                <div className="rounded px-2 py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                    <span>🍅</span> {seeds.tomato}
                                </div>
                                <div className="rounded px-2 py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                    <span>🥕</span> {seeds.carrot}
                                </div>
                            </div>
                        </div>

                        {/* Harvested Items - Always show eggs */}
                        <div className="text-xs space-y-1 pt-2 border-t" style={{ borderColor: 'rgba(176, 144, 96, 0.4)' }}>
                            <p className="font-semibold mb-1" style={{ color: '#c4a06a' }}>🥚 Inventory:</p>
                            <div className="rounded px-2 py-1" style={{ backgroundColor: 'rgba(46, 26, 14, 0.6)', color: '#e8d5b0' }}>
                                <span>🥚</span> Eggs: {harvested.egg}
                            </div>
                        </div>

                        <div className="text-xs space-y-1 pt-2 border-t" style={{ borderColor: 'rgba(176, 144, 96, 0.4)' }}>
                            <p className="font-semibold" style={{ color: '#c4a06a' }}>📊 Farm Status:</p>
                            <div className="space-y-0.5" style={{ color: '#e8d5b0' }}>
                                <p>🟫 Untilled: {farmStats.untilled}</p>
                                <p>🟤 Tilled: {farmStats.tilled}</p>
                                <p>🌱 Planted: {farmStats.planted}</p>
                                <p>✨ Ready: {farmStats.ready}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => useStore.getState().ui.openGameModal('codex', null)}
                            className="w-full mt-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(to right, #4a3020, #3a2515)', borderColor: '#b09060', color: '#e8d5b0' }}
                        >
                            <span className="text-lg">📚</span>
                            <span>Heritage Codex</span>
                        </button>

                        <button
                            onClick={() => useStore.getState().ui.openGameModal('shop', null)}
                            className="w-full mt-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(to right, #4a3020, #3a2515)', borderColor: '#b09060', color: '#e8d5b0' }}
                        >
                            <span className="text-lg">🏪</span>
                            <span>Seed Shop</span>
                        </button>

                        {/* Audio Toggle */}
                        <div className="mt-2">
                            <AudioToggle
                                className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                style={{ background: 'linear-gradient(to right, #4a3020, #3a2515)', borderColor: '#b09060', color: '#e8d5b0' }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <EducationalModal />
            <HeritageCodex />
            <SettingsModal />
            {modalOpen === 'shop' && <Shop />}
            {modalOpen === 'day-summary' && <DaySummary />}

            <NPCDialogue />

            <DayTransition />

            {/* Quest Completion Notification */}
            {completedQuest && (
                <QuestCompletionNotification
                    quest={completedQuest}
                    onClose={clearCompletedQuest}
                />
            )}
        </div>
    );
}

export default HeritageHarvestGame;
