import { useStore } from '@/state/store';
import { CROPS_CONFIG } from '@/features/crops/crops.config';
import './Inventory.css';

function Inventory() {
    const coins = useStore((s) => s.inventory.coins);
    const seeds = useStore((s) => s.inventory.seeds);
    const harvestedItems = useStore((s) => s.inventory.harvestedItems);
    const selectedSeed = useStore((s) => s.ui.selectedSeed);
    const currentDay = useStore((s) => s.game.currentDay);
    const timeOfDay = useStore((s) => s.game.timeOfDay);
    const openGameModal = useStore((s) => s.ui.openGameModal);

    const getTimeLabel = (time) => {
        if (time < 0.25) return 'Morning';
        if (time < 0.5) return 'Midday';
        if (time < 0.75) return 'Afternoon';
        return 'Evening';
    };

    const getCropEmoji = (cropType) => {
        // Map corn to bean since config uses bean
        const mappedType = cropType === 'corn' ? 'bean' : cropType;
        const crop = CROPS_CONFIG.CROPS[mappedType];
        return crop ? crop.icon : '🌱';
    };

    const handleSeedClick = (cropType) => {
        // Map corn to bean since config uses bean
        const mappedType = cropType === 'corn' ? 'bean' : cropType;
        openGameModal('educational', { cropId: mappedType });
    };

    const handleHarvestedClick = (cropType) => {
        // Map corn to bean since config uses bean
        const mappedType = cropType === 'corn' ? 'bean' : cropType;
        openGameModal('educational', { cropId: mappedType });
    };

    const timeLabel = getTimeLabel(timeOfDay);
    const progressPercent = (timeOfDay * 100).toFixed(1);

    return (
        <div className="inventory">
            <div className="inventory__content">
                {/* Day & Time */}
                <div className="inventory__section">
                    <div className="inventory__day">
                        <span className="inventory__day-label">Day</span>
                        <span className="inventory__day-value">{currentDay}</span>
                    </div>
                    <div className="inventory__time">
                        <span className="inventory__time-label">{timeLabel}</span>
                    </div>
                    <div className="inventory__progress">
                        <div className="inventory__progress-bar">
                            <div
                                className="inventory__progress-fill"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className="inventory__progress-text">{progressPercent}%</span>
                    </div>
                </div>

                {/* Coins */}
                <div className="inventory__section">
                    <div className="inventory__coins">
                        <span className="inventory__coin-icon">🪙</span>
                        <span className="inventory__coin-value">{coins}</span>
                    </div>
                </div>

                {/* Seeds */}
                <div className="inventory__section">
                    <div className="inventory__section-title">Seeds</div>
                    <div className="inventory__seeds">
                        {seeds && Object.entries(seeds).map(([cropType, count]) => (
                            <div
                                key={cropType}
                                className={`inventory__seed-item ${selectedSeed === cropType ? 'inventory__seed-item--selected' : ''}`}
                                onClick={() => handleSeedClick(cropType)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="inventory__seed-icon">
                                    {getCropEmoji(cropType)}
                                </span>
                                <span className="inventory__seed-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Harvested Items */}
                {harvestedItems && Object.keys(harvestedItems).length > 0 && (
                    <div className="inventory__section">
                        <div className="inventory__section-title">Harvested</div>
                        <div className="inventory__harvested">
                            {Object.entries(harvestedItems).map(([cropType, count]) => (
                                <div
                                    key={cropType}
                                    className="inventory__harvested-item"
                                    onClick={() => handleHarvestedClick(cropType)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="inventory__harvested-icon">
                                        {getCropEmoji(cropType)}
                                    </span>
                                    <span className="inventory__harvested-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Inventory;
