import { useStore } from '@/state/store';
import { FARM_CONFIG } from '@/features/farm/farm.config';
import { CROPS_CONFIG } from '@/features/crops/crops.config';
import { ANIMALS_CONFIG } from '@/features/animals/animals.config';
import { UPGRADES_CONFIG, canPurchaseUpgrade } from './upgrades.config';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Shop.css';

/**
 * Shop Component
 * 
 * Allows players to purchase seeds using coins with quantity selection.
 * Displays available seeds with prices and purchase buttons.
 * 
 * Requirements: 2.1.4, 2.1.5, 2.1.6
 */
function Shop() {
    const coins = useStore((s) => s.inventory.coins);
    const seeds = useStore((s) => s.inventory.seeds);
    const harvested = useStore((s) => s.inventory.harvested);
    const upgrades = useStore((s) => s.inventory.upgrades);
    const addSeeds = useStore((s) => s.inventory.addSeeds);
    const addCoins = useStore((s) => s.inventory.addCoins);
    const spendCoins = useStore((s) => s.inventory.spendCoins);
    const purchaseUpgrade = useStore((s) => s.inventory.purchaseUpgrade);
    const closeGameModal = useStore((s) => s.ui.closeGameModal);

    // Tab state: 'buy', 'sell', or 'upgrades'
    const [activeTab, setActiveTab] = useState('buy');

    // State for confirmation dialog
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Shop-specific feedback (not global)
    const [shopFeedback, setShopFeedback] = useState(null);

    // Auto-dismiss feedback after 3 seconds
    useEffect(() => {
        if (shopFeedback) {
            const timer = setTimeout(() => {
                setShopFeedback(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [shopFeedback]);

    const handleBuyClick = (cropType) => {
        const cost = FARM_CONFIG.SEED_COSTS[cropType];
        const crop = CROPS_CONFIG.CROPS[cropType];

        // Open confirmation dialog
        setConfirmDialog({
            cropType,
            cropName: crop.name,
            cost,
            icon: crop.icon
        });
        setQuantity(1);
    };

    const handleConfirmPurchase = () => {
        if (!confirmDialog) return;

        const { cropType, cropName } = confirmDialog;
        const cost = FARM_CONFIG.SEED_COSTS[cropType];
        const totalCost = cost * quantity;

        if (coins >= totalCost) {
            // Check inventory capacity before purchase
            const result = addSeeds(cropType, quantity);

            if (result.success) {
                // Purchase successful
                spendCoins(totalCost);
                setShopFeedback({
                    success: true,
                    message: `Success! You bought ${quantity} ${cropName} seed${quantity > 1 ? 's' : ''}!`
                });
                setConfirmDialog(null);
                setQuantity(1);
            } else {
                // Inventory full
                setShopFeedback({
                    success: false,
                    message: result.message
                });
                setConfirmDialog(null);
                setQuantity(1);
            }
        } else {
            // Insufficient funds
            setShopFeedback({
                success: false,
                message: `Not enough coins! Need ${totalCost} coins`
            });
        }
    };

    const handleCancelPurchase = () => {
        setConfirmDialog(null);
        setQuantity(1);
    };

    const handleSellEggs = () => {
        const eggCount = harvested.egg || 0;
        if (eggCount > 0) {
            const eggValue = ANIMALS_CONFIG.chicken.eggValue;
            const totalValue = eggCount * eggValue;

            // Sell all eggs
            useStore.getState().inventory.addCoins(totalValue);
            useStore.setState((s) => ({
                inventory: {
                    ...s.inventory,
                    harvested: {
                        ...s.inventory.harvested,
                        egg: 0
                    }
                }
            }));

            setShopFeedback({
                success: true,
                message: `Sold ${eggCount} egg${eggCount > 1 ? 's' : ''} for ${totalValue} coins!`
            });
        }
    };

    const handleSellCrop = (cropType) => {
        const cropCount = harvested[cropType] || 0;
        if (cropCount > 0) {
            const cropValue = FARM_CONFIG.CROP_VALUES[cropType];
            const totalValue = cropCount * cropValue;
            const cropName = getCropName(cropType);

            // Sell all crops of this type
            useStore.getState().inventory.addCoins(totalValue);
            useStore.setState((s) => ({
                inventory: {
                    ...s.inventory,
                    harvested: {
                        ...s.inventory.harvested,
                        [cropType]: 0
                    }
                }
            }));

            setShopFeedback({
                success: true,
                message: `Sold ${cropCount} ${cropName}${cropCount > 1 ? 's' : ''} for ${totalValue} coins!`
            });
        }
    };

    const handleSellAll = () => {
        let totalValue = 0;
        let itemsSold = 0;

        // Calculate total value of all items
        Object.keys(FARM_CONFIG.CROP_VALUES).forEach(cropType => {
            const count = harvested[cropType] || 0;
            if (count > 0) {
                totalValue += count * FARM_CONFIG.CROP_VALUES[cropType];
                itemsSold += count;
            }
        });

        // Add eggs
        const eggCount = harvested.egg || 0;
        if (eggCount > 0) {
            totalValue += eggCount * ANIMALS_CONFIG.chicken.eggValue;
            itemsSold += eggCount;
        }

        if (itemsSold > 0) {
            // Sell everything
            useStore.getState().inventory.addCoins(totalValue);
            useStore.setState((s) => ({
                inventory: {
                    ...s.inventory,
                    harvested: {
                        bean: 0,
                        wheat: 0,
                        tomato: 0,
                        carrot: 0,
                        egg: 0
                    }
                }
            }));

            setShopFeedback({
                success: true,
                message: `Sold ${itemsSold} item${itemsSold > 1 ? 's' : ''} for ${totalValue} coins!`
            });
        }
    };

    const handlePurchaseUpgrade = (upgradeType, tier, cost, name) => {
        const result = purchaseUpgrade(upgradeType, tier, cost);

        if (result.success) {
            setShopFeedback({
                success: true,
                message: `🎉 Upgrade purchased: ${name}!`
            });

            // Trigger celebration animation
            triggerCelebration();
        } else {
            setShopFeedback({
                success: false,
                message: result.message
            });
        }
    };

    // Celebration animation trigger
    const triggerCelebration = () => {
        // Create confetti effect
        const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4CAF50', '#2196F3'];
        const confettiCount = 30;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear forwards`;

                document.body.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 4000);
            }, i * 50);
        }
    };

    const handleQuantityChange = (delta) => {
        const newQuantity = Math.max(1, quantity + delta);

        // Calculate max based on coins AND seed inventory space
        const maxAffordableByCoins = Math.floor(coins / confirmDialog.cost);
        const currentSeedCount = useStore.getState().inventory.getSeedsInventoryCount();
        const maxCapacity = useStore.getState().inventory.upgrades.inventorySize;
        const availableSpace = maxCapacity - currentSeedCount;
        const maxPurchasable = Math.min(maxAffordableByCoins, availableSpace);

        setQuantity(Math.min(newQuantity, Math.max(1, maxPurchasable)));
    };

    const getCropEmoji = (cropType) => {
        const crop = CROPS_CONFIG.CROPS[cropType];
        return crop ? crop.icon : '🌱';
    };

    const getCropName = (cropType) => {
        const crop = CROPS_CONFIG.CROPS[cropType];
        return crop ? crop.name : cropType;
    };

    // Calculate max purchasable based on coins AND seed inventory space
    const currentSeedCount = useStore.getState().inventory.getSeedsInventoryCount();
    const maxCapacity = useStore.getState().inventory.upgrades.inventorySize;
    const availableSpace = maxCapacity - currentSeedCount;
    const maxAffordableByCoins = confirmDialog ? Math.floor(coins / confirmDialog.cost) : 0;
    const maxAffordable = Math.min(maxAffordableByCoins, availableSpace);
    const totalCost = confirmDialog ? confirmDialog.cost * quantity : 0;
    const canAfford = totalCost <= coins && quantity <= availableSpace;

    return (
        <div className="shop">
            {/* Header Bar */}
            <div className="shop__header">
                <div className="shop__header-content">
                    <div className="shop__title-section">
                        <span className="shop__title-icon">🏪</span>
                        <h2 className="shop__title">Seed Shop</h2>
                    </div>
                    <div className="shop__balance">
                        <span className="shop__balance-icon">🪙</span>
                        <span className="shop__balance-value">{coins}</span>
                        <span className="shop__balance-label">coins</span>
                    </div>
                    <button
                        className="shop__close"
                        onClick={closeGameModal}
                        aria-label="Close shop"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="shop__main">
                {/* Tabs */}
                <div className="shop__tabs">
                    <button
                        className={`shop__tab ${activeTab === 'buy' ? 'shop__tab--active' : ''}`}
                        onClick={() => setActiveTab('buy')}
                    >
                        🛒 Buy Seeds
                    </button>
                    <button
                        className={`shop__tab ${activeTab === 'sell' ? 'shop__tab--active' : ''}`}
                        onClick={() => setActiveTab('sell')}
                    >
                        💰 Sell Items
                    </button>
                    <button
                        className={`shop__tab ${activeTab === 'upgrades' ? 'shop__tab--active' : ''}`}
                        onClick={() => setActiveTab('upgrades')}
                    >
                        ⚙️ Upgrades
                    </button>
                </div>

                {/* Buy Tab Content */}
                {activeTab === 'buy' && (
                    <>
                        {/* Welcome Banner */}
                        <div className="shop__banner">
                            <h3 className="shop__banner-title">Welcome to the Seed Shop!</h3>
                            <p className="shop__banner-text">
                                Purchase seeds to grow your farm. Harvest crops to earn more coins!
                            </p>
                        </div>

                        {/* Seed Grid */}
                        <div className="shop__items">
                            {Object.keys(FARM_CONFIG.SEED_COSTS).map((cropType) => {
                                const cost = FARM_CONFIG.SEED_COSTS[cropType];
                                const currentCount = seeds[cropType] || 0;
                                const currentSeedCount = useStore.getState().inventory.getSeedsInventoryCount();
                                const maxCapacity = useStore.getState().inventory.upgrades.inventorySize;
                                const isSeedInventoryFull = currentSeedCount >= maxCapacity;
                                const canAffordOne = coins >= cost && !isSeedInventoryFull;

                                return (
                                    <div key={cropType} className="shop__item">
                                        <div className="shop__item-header">
                                            <div className="shop__item-icon">
                                                {getCropEmoji(cropType)}
                                            </div>
                                            <div className="shop__item-badge">
                                                {currentCount} owned
                                            </div>
                                        </div>
                                        <div className="shop__item-body">
                                            <h4 className="shop__item-name">
                                                {getCropName(cropType)}
                                            </h4>
                                            <div className="shop__item-price">
                                                <span className="shop__item-price-icon">🪙</span>
                                                <span className="shop__item-price-value">{cost}</span>
                                            </div>
                                        </div>
                                        <button
                                            className={`shop__item-button ${!canAffordOne ? 'shop__item-button--disabled' : ''}`}
                                            onClick={() => handleBuyClick(cropType)}
                                            disabled={!canAffordOne}
                                        >
                                            {isSeedInventoryFull ? '🎒 Inventory Full' : coins < cost ? '💰 Too Expensive' : '🛒 Buy Seeds'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Sell Tab Content */}
                {activeTab === 'sell' && (
                    <>
                        {/* Sell Banner */}
                        <div className="shop__banner">
                            <h3 className="shop__banner-title">Sell Your Products!</h3>
                            <p className="shop__banner-text">
                                Turn your farm products into coins!
                            </p>
                        </div>

                        {/* Sell Items */}
                        <div className="shop__items">
                            {/* Crops */}
                            {Object.keys(FARM_CONFIG.CROP_VALUES).map((cropType) => {
                                const count = harvested[cropType] || 0;
                                if (count === 0) return null;

                                const value = FARM_CONFIG.CROP_VALUES[cropType];
                                const totalValue = count * value;

                                return (
                                    <div key={cropType} className="shop__item">
                                        <div className="shop__item-header">
                                            <div className="shop__item-icon">
                                                {getCropEmoji(cropType)}
                                            </div>
                                            <div className="shop__item-badge">
                                                {count} available
                                            </div>
                                        </div>
                                        <div className="shop__item-body">
                                            <h4 className="shop__item-name">
                                                {getCropName(cropType)}
                                            </h4>
                                            <div className="shop__item-price">
                                                <span className="shop__item-price-icon">🪙</span>
                                                <span className="shop__item-price-value">
                                                    {value} each
                                                </span>
                                            </div>
                                            <div className="shop__item-total">
                                                Total: {totalValue} coins
                                            </div>
                                        </div>
                                        <button
                                            className="shop__item-button shop__item-button--sell"
                                            onClick={() => handleSellCrop(cropType)}
                                        >
                                            💰 Sell All {getCropName(cropType)}s
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Eggs */}
                            {harvested.egg > 0 && (
                                <div className="shop__item">
                                    <div className="shop__item-header">
                                        <div className="shop__item-icon">🥚</div>
                                        <div className="shop__item-badge">
                                            {harvested.egg} available
                                        </div>
                                    </div>
                                    <div className="shop__item-body">
                                        <h4 className="shop__item-name">Eggs</h4>
                                        <div className="shop__item-price">
                                            <span className="shop__item-price-icon">🪙</span>
                                            <span className="shop__item-price-value">
                                                {ANIMALS_CONFIG.chicken.eggValue} each
                                            </span>
                                        </div>
                                        <div className="shop__item-total">
                                            Total: {harvested.egg * ANIMALS_CONFIG.chicken.eggValue} coins
                                        </div>
                                    </div>
                                    <button
                                        className="shop__item-button shop__item-button--sell"
                                        onClick={handleSellEggs}
                                    >
                                        💰 Sell All Eggs
                                    </button>
                                </div>
                            )}

                            {/* No items message */}
                            {Object.keys(FARM_CONFIG.CROP_VALUES).every(crop => (harvested[crop] || 0) === 0) &&
                                harvested.egg === 0 && (
                                    <div className="shop__empty">
                                        <span className="shop__empty-icon">🌾</span>
                                        <p className="shop__empty-text">
                                            No items to sell yet!
                                        </p>
                                        <p className="shop__empty-hint">
                                            Harvest crops and collect eggs to earn coins.
                                        </p>
                                    </div>
                                )}
                        </div>

                        {/* Sell All Button */}
                        {(Object.keys(FARM_CONFIG.CROP_VALUES).some(crop => (harvested[crop] || 0) > 0) ||
                            harvested.egg > 0) && (
                                <div className="shop__sell-all-section">
                                    <button
                                        className="shop__sell-all-button"
                                        onClick={handleSellAll}
                                    >
                                        💰 Sell Everything
                                    </button>
                                </div>
                            )}
                    </>
                )}

                {/* Upgrades Tab Content */}
                {activeTab === 'upgrades' && (
                    <>
                        {/* Upgrades Banner */}
                        <div className="shop__banner">
                            <h3 className="shop__banner-title">Upgrade Your Tools!</h3>
                            <p className="shop__banner-text">
                                Improve your farming efficiency with better tools and more storage.
                            </p>
                        </div>

                        {/* Watering Can Upgrades */}
                        <div className="shop__upgrade-section">
                            <h4 className="shop__upgrade-section-title">🚿 Watering Can Upgrades</h4>
                            <div className="shop__items">
                                {Object.entries(UPGRADES_CONFIG.wateringCan).map(([tier, upgrade]) => {
                                    const isOwned = upgrades.wateringCan === tier;
                                    const canPurchase = canPurchaseUpgrade('wateringCan', tier, upgrades.wateringCan, coins);
                                    const isLocked = !isOwned && !canPurchase && coins >= upgrade.cost;

                                    return (
                                        <div key={tier} className="shop__item">
                                            <div className="shop__item-header">
                                                <div className="shop__item-icon">{upgrade.icon}</div>
                                                {isOwned && (
                                                    <div className="shop__item-badge shop__item-badge--owned">
                                                        ✓ Owned
                                                    </div>
                                                )}
                                                {isLocked && (
                                                    <div className="shop__item-badge shop__item-badge--locked">
                                                        🔒 Locked
                                                    </div>
                                                )}
                                            </div>
                                            <div className="shop__item-body">
                                                <h4 className="shop__item-name">{upgrade.name}</h4>
                                                <p className="shop__upgrade-description">{upgrade.description}</p>
                                                {upgrade.cost > 0 && (
                                                    <div className="shop__item-price">
                                                        <span className="shop__item-price-icon">🪙</span>
                                                        <span className="shop__item-price-value">{upgrade.cost}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {!isOwned && (
                                                <button
                                                    className={`shop__item-button ${!canPurchase ? 'shop__item-button--disabled' : ''}`}
                                                    onClick={() => handlePurchaseUpgrade('wateringCan', tier, upgrade.cost, upgrade.name)}
                                                    disabled={!canPurchase}
                                                >
                                                    {canPurchase ? '⚙️ Purchase' : isLocked ? '🔒 Locked' : '💰 Too Expensive'}
                                                </button>
                                            )}
                                            {isOwned && (
                                                <div className="shop__item-button shop__item-button--owned">
                                                    ✓ Currently Equipped
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Inventory Upgrades */}
                        <div className="shop__upgrade-section">
                            <h4 className="shop__upgrade-section-title">🎒 Inventory Upgrades</h4>
                            <div className="shop__items">
                                {Object.entries(UPGRADES_CONFIG.inventorySize).map(([size, upgrade]) => {
                                    const isOwned = upgrades.inventorySize === Number(size);
                                    const canPurchase = canPurchaseUpgrade('inventorySize', Number(size), upgrades.inventorySize, coins);
                                    const isLocked = !isOwned && !canPurchase && coins >= upgrade.cost;

                                    return (
                                        <div key={size} className="shop__item">
                                            <div className="shop__item-header">
                                                <div className="shop__item-icon">{upgrade.icon}</div>
                                                {isOwned && (
                                                    <div className="shop__item-badge shop__item-badge--owned">
                                                        ✓ Owned
                                                    </div>
                                                )}
                                                {isLocked && (
                                                    <div className="shop__item-badge shop__item-badge--locked">
                                                        🔒 Locked
                                                    </div>
                                                )}
                                            </div>
                                            <div className="shop__item-body">
                                                <h4 className="shop__item-name">{upgrade.name}</h4>
                                                <p className="shop__upgrade-description">{upgrade.description}</p>
                                                {upgrade.cost > 0 && (
                                                    <div className="shop__item-price">
                                                        <span className="shop__item-price-icon">🪙</span>
                                                        <span className="shop__item-price-value">{upgrade.cost}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {!isOwned && (
                                                <button
                                                    className={`shop__item-button ${!canPurchase ? 'shop__item-button--disabled' : ''}`}
                                                    onClick={() => handlePurchaseUpgrade('inventorySize', Number(size), upgrade.cost, upgrade.name)}
                                                    disabled={!canPurchase}
                                                >
                                                    {canPurchase ? '⚙️ Purchase' : isLocked ? '🔒 Locked' : '💰 Too Expensive'}
                                                </button>
                                            )}
                                            {isOwned && (
                                                <div className="shop__item-button shop__item-button--owned">
                                                    ✓ Currently Active
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* Footer Tips */}
                <div className="shop__footer">
                    <div className="shop__tip">
                        <span className="shop__tip-icon">💡</span>
                        <span className="shop__tip-text">
                            Tip: Different crops have different growth times and values!
                        </span>
                    </div>
                </div>
            </div>

            {/* Shop Feedback (inside shop) */}
            <AnimatePresence>
                {shopFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="shop__feedback"
                    >
                        <div className={`shop__feedback-message ${shopFeedback.success ? 'shop__feedback-message--success' : 'shop__feedback-message--error'}`}>
                            {shopFeedback.message}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <div className="shop__confirm-overlay">
                    <div className="shop__confirm-dialog">
                        <div className="shop__confirm-header">
                            <span className="shop__confirm-icon">{confirmDialog.icon}</span>
                            <h3 className="shop__confirm-title">
                                Purchase {confirmDialog.cropName} Seeds
                            </h3>
                        </div>

                        <div className="shop__confirm-body">
                            {/* Quantity Selector */}
                            <div className="shop__quantity-section">
                                <label className="shop__quantity-label">Quantity:</label>
                                <div className="shop__quantity-controls">
                                    <button
                                        className="shop__quantity-button"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="shop__quantity-value">{quantity}</span>
                                    <button
                                        className="shop__quantity-button"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= maxAffordable}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="shop__quantity-info">
                                    {availableSpace === 0 ? (
                                        <span style={{ color: '#ff6b6b' }}>Seed inventory full! ({currentSeedCount}/{maxCapacity})</span>
                                    ) : maxAffordableByCoins > availableSpace ? (
                                        <span>Max: {maxAffordable} (limited by inventory space: {currentSeedCount}/{maxCapacity})</span>
                                    ) : (
                                        <span>Max affordable: {maxAffordable}</span>
                                    )}
                                </div>
                            </div>

                            {/* Cost Summary */}
                            <div className="shop__cost-summary">
                                <div className="shop__cost-row">
                                    <span>Price per seed:</span>
                                    <span className="shop__cost-value">
                                        🪙 {confirmDialog.cost}
                                    </span>
                                </div>
                                <div className="shop__cost-row shop__cost-row--total">
                                    <span>Total cost:</span>
                                    <span className="shop__cost-value shop__cost-value--total">
                                        🪙 {totalCost}
                                    </span>
                                </div>
                                <div className="shop__cost-row">
                                    <span>Your coins:</span>
                                    <span className={`shop__cost-value ${!canAfford ? 'shop__cost-value--insufficient' : ''}`}>
                                        🪙 {coins}
                                    </span>
                                </div>
                            </div>

                            {!canAfford && coins < totalCost && (
                                <div className="shop__warning">
                                    ⚠️ Not enough coins!
                                </div>
                            )}
                            {!canAfford && quantity > availableSpace && (
                                <div className="shop__warning">
                                    ⚠️ Not enough seed inventory space! ({currentSeedCount}/{maxCapacity} used)
                                </div>
                            )}
                        </div>

                        <div className="shop__confirm-actions">
                            <button
                                className="shop__confirm-button shop__confirm-button--cancel"
                                onClick={handleCancelPurchase}
                            >
                                Cancel
                            </button>
                            <button
                                className={`shop__confirm-button shop__confirm-button--confirm ${!canAfford ? 'shop__confirm-button--disabled' : ''}`}
                                onClick={handleConfirmPurchase}
                                disabled={!canAfford}
                            >
                                Confirm Purchase
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Shop;
