import { useStore } from '@/state/store';
import { FARM_CONFIG } from '@/features/farm/farm.config';
import { CROPS_CONFIG } from '@/features/crops/crops.config';
import { ANIMALS_CONFIG } from '@/features/animals/animals.config';
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
    const addSeeds = useStore((s) => s.inventory.addSeeds);
    const addCoins = useStore((s) => s.inventory.addCoins);
    const spendCoins = useStore((s) => s.inventory.spendCoins);
    const closeGameModal = useStore((s) => s.ui.closeGameModal);

    // Tab state: 'buy' or 'sell'
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
            // Purchase successful
            spendCoins(totalCost);
            addSeeds(cropType, quantity);
            setShopFeedback({
                success: true,
                message: `Success! You bought ${quantity} ${cropName} seed${quantity > 1 ? 's' : ''}!`
            });
            setConfirmDialog(null);
            setQuantity(1);
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

    const handleQuantityChange = (delta) => {
        const newQuantity = Math.max(1, quantity + delta);
        const maxAffordable = Math.floor(coins / confirmDialog.cost);
        setQuantity(Math.min(newQuantity, Math.max(1, maxAffordable)));
    };

    const getCropEmoji = (cropType) => {
        const crop = CROPS_CONFIG.CROPS[cropType];
        return crop ? crop.icon : '🌱';
    };

    const getCropName = (cropType) => {
        const crop = CROPS_CONFIG.CROPS[cropType];
        return crop ? crop.name : cropType;
    };

    const maxAffordable = confirmDialog ? Math.floor(coins / confirmDialog.cost) : 0;
    const totalCost = confirmDialog ? confirmDialog.cost * quantity : 0;
    const canAfford = totalCost <= coins;

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
                                const canAffordOne = coins >= cost;

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
                                            {canAffordOne ? '🛒 Buy Seeds' : '💰 Too Expensive'}
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
                            {harvested.egg === 0 && (
                                <div className="shop__empty">
                                    <span className="shop__empty-icon">🥚</span>
                                    <p className="shop__empty-text">
                                        No eggs to sell yet!
                                    </p>
                                    <p className="shop__empty-hint">
                                        Feed your chickens to get eggs tomorrow.
                                    </p>
                                </div>
                            )}
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
                                    Max affordable: {maxAffordable}
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

                            {!canAfford && (
                                <div className="shop__warning">
                                    ⚠️ Not enough coins!
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
