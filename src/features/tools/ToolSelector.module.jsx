import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { getAllTools } from './tools.config';

/**
 * ToolSelector Component
 * 
 * Displays available tools in a horizontal bar at the bottom-center.
 * Highlights currently selected tool.
 * Updates Zustand ui.selectedTool on button click.
 * 
 * Requirements: 1.6.5, 1.8.5
 */
function ToolSelector() {
    const selectedTool = useStore((s) => s.ui.selectedTool);
    const setTool = useStore((s) => s.ui.setTool);
    const updateInteraction = useStore((s) => s.session.updateInteraction);
    const wateringCanLevel = useStore((s) => s.inventory.upgrades.wateringCan);

    const tools = getAllTools();

    const handleToolSelect = (toolId) => {
        // Toggle: if clicking the same tool, deselect it (set to 'none')
        if (selectedTool === toolId) {
            setTool('none');
        } else {
            setTool(toolId);
        }
        updateInteraction();
    };

    // Get watering can icon based on upgrade level
    const getWateringCanIcon = () => {
        switch (wateringCanLevel) {
            case 'copper':
                return '🟠';
            case 'steel':
                return '⚙️';
            default:
                return '💧';
        }
    };

    // Get watering can name based on upgrade level
    const getWateringCanName = () => {
        switch (wateringCanLevel) {
            case 'copper':
                return 'Copper Can';
            case 'steel':
                return 'Steel Can';
            default:
                return 'Water';
        }
    };

    return (
        <div className="fixed top-1/2 right-2 sm:right-4 transform -translate-y-1/2 pointer-events-auto z-50">
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="flex flex-col gap-2 sm:gap-3 backdrop-blur-sm rounded-2xl px-2 py-2 sm:px-3 sm:py-4 shadow-2xl border-2"
                style={{ backgroundColor: 'rgba(58, 37, 24, 0.95)', borderColor: '#b09060' }}
            >
                {tools.map((tool) => {
                    const isSelected = selectedTool === tool.id;

                    // Override watering can icon and name based on upgrade level
                    const displayIcon = tool.id === 'watering_can' ? getWateringCanIcon() : tool.icon;
                    const displayName = tool.id === 'watering_can' ? getWateringCanName() : tool.name;
                    const showUpgradeBadge = tool.id === 'watering_can' && wateringCanLevel !== 'basic';

                    return (
                        <motion.button
                            key={tool.id}
                            onClick={() => handleToolSelect(tool.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                relative flex flex-col items-center justify-center
                                w-14 h-14 sm:w-20 sm:h-20 rounded-xl transition-all duration-200 border-2
                                ${isSelected ? 'shadow-lg border-[#b09060]' : 'hover:opacity-90 border-[#4a3020]'}
                            `}
                            style={{
                                backgroundColor: isSelected ? '#5a4030' : 'rgba(46, 26, 14, 0.7)',
                            }}
                        >
                            {tool.iconImage ? (
                                <img
                                    src={tool.iconImage}
                                    alt={displayName}
                                    className="w-10 h-10 sm:w-14 sm:h-14 mb-0.5 object-cover"
                                    style={{
                                        imageRendering: 'pixelated',
                                        transform: (tool.id === 'hoe' || tool.id === 'watering_can') ? 'scale(1.3)' : 'scale(1)'
                                    }}
                                />
                            ) : (
                                <span className="text-xl sm:text-2xl mb-0.5">{displayIcon}</span>
                            )}
                            <span className={`text-[8px] sm:text-[10px] font-semibold leading-tight ${isSelected ? 'text-[#e8d5b0]' : 'text-[#b09060]'}`}>
                                {displayName}
                            </span>
                            {showUpgradeBadge && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center">
                                    <span className="text-[8px] sm:text-[10px]">⬆</span>
                                </div>
                            )}
                            {isSelected && (
                                <motion.div
                                    layoutId="tool-selector"
                                    className="absolute inset-0 rounded-xl border-2 border-[#c4a06a]"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}

export default ToolSelector;
