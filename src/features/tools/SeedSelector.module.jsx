import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/state/store';
import { getAllCrops } from '@/features/crops/crops.config';

/**
 * SeedSelector Component
 * 
 * Appears when Seed Bag tool is selected.
 * Shows 4 crop options with seed counts.
 * Allows player to choose which crop to plant.
 * Disables crops when out of seeds.
 * 
 * Requirements: 1.6.5, 1.8.5, Task 24
 */
function SeedSelector() {
    const selectedTool = useStore((s) => s.ui.selectedTool);
    const selectedSeed = useStore((s) => s.ui.selectedSeed);
    const setSelectedSeed = useStore((s) => s.ui.setSelectedSeed);
    const seeds = useStore((s) => s.inventory.seeds);
    const updateInteraction = useStore((s) => s.session.updateInteraction);

    const crops = getAllCrops();

    // Only show when Seed Bag is selected
    const isVisible = selectedTool === 'seed_bag';

    const handleSeedSelect = (cropId) => {
        // Check if seeds available
        if (seeds[cropId] <= 0) {
            return; // Can't select if no seeds
        }

        setSelectedSeed(cropId);
        updateInteraction();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="fixed top-1/2 right-32 transform -translate-y-1/2 pointer-events-auto z-40"
                >
                    <div className="bg-amber-900/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-2xl border-2 border-amber-700">
                        <p className="text-xs font-semibold text-amber-200 mb-2 text-center">
                            Choose Seed
                        </p>

                        <div className="flex flex-col gap-2">
                            {crops.map((crop) => {
                                const seedCount = seeds[crop.id] || 0;
                                const isSelected = selectedSeed === crop.id;
                                const isDisabled = seedCount <= 0;

                                return (
                                    <motion.button
                                        key={crop.id}
                                        onClick={() => handleSeedSelect(crop.id)}
                                        disabled={isDisabled}
                                        whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                        className={`
                                            relative flex items-center gap-2
                                            px-3 py-2 rounded-lg
                                            transition-all duration-200
                                            ${isSelected && !isDisabled
                                                ? 'bg-green-600 shadow-lg border-2 border-green-400'
                                                : isDisabled
                                                    ? 'bg-gray-700/50 opacity-50 cursor-not-allowed'
                                                    : 'bg-amber-800/50 hover:bg-amber-700/70 border-2 border-amber-700/50'
                                            }
                                        `}
                                    >
                                        {/* Crop Icon */}
                                        <span className="text-2xl">{crop.icon}</span>

                                        {/* Crop Info */}
                                        <div className="flex-1 text-left">
                                            <p className={`text-xs font-semibold ${isDisabled ? 'text-gray-400' : 'text-amber-100'}`}>
                                                {crop.name}
                                            </p>
                                            <p className={`text-[10px] ${isDisabled ? 'text-gray-500' : 'text-amber-300'}`}>
                                                {seedCount} seeds
                                            </p>
                                        </div>

                                        {/* Selected Indicator */}
                                        {isSelected && !isDisabled && (
                                            <motion.div
                                                layoutId="seed-selector"
                                                className="absolute inset-0 rounded-lg border-2 border-yellow-400"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 300,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        {/* Out of Seeds Badge */}
                                        {isDisabled && (
                                            <span className="text-[10px] text-red-400 font-bold">
                                                OUT
                                            </span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Helper Text */}
                        <p className="text-[10px] text-amber-400 mt-2 text-center">
                            Click watered soil to plant
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default SeedSelector;
