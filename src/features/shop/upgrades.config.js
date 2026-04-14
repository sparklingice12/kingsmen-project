/**
 * Upgrades Configuration
 * 
 * Defines available upgrades, their costs, and benefits
 */

export const UPGRADES_CONFIG = {
    wateringCan: {
        basic: {
            id: 'basic',
            name: 'Basic Watering Can',
            icon: '💧',
            cost: 0,
            description: 'Waters 1 tile at a time',
            areaSize: 1, // 1x1
            owned: true, // Default tool
        },
        copper: {
            id: 'copper',
            name: 'Copper Watering Can',
            icon: '🟠',
            cost: 50,
            description: 'Waters 3×3 area (9 tiles)',
            areaSize: 3, // 3x3
            owned: false,
        },
        steel: {
            id: 'steel',
            name: 'Steel Watering Can',
            icon: '⚙️',
            cost: 100,
            description: 'Waters 5×5 area (25 tiles)',
            areaSize: 5, // 5x5
            owned: false,
        },
    },
    inventorySize: {
        12: {
            id: 12,
            name: 'Basic Inventory',
            icon: '🎒',
            cost: 0,
            description: '12 inventory slots',
            slots: 12,
            owned: true, // Default size
        },
        24: {
            id: 24,
            name: 'Large Inventory',
            icon: '🎒',
            cost: 75,
            description: '24 inventory slots',
            slots: 24,
            owned: false,
        },
        48: {
            id: 48,
            name: 'Huge Inventory',
            icon: '🎒',
            cost: 150,
            description: '48 inventory slots',
            slots: 48,
            owned: false,
        },
    },
};

/**
 * Get upgrade configuration by type and tier
 */
export function getUpgradeConfig(upgradeType, tier) {
    return UPGRADES_CONFIG[upgradeType]?.[tier] || null;
}

/**
 * Get all upgrades for a specific type
 */
export function getUpgradesByType(upgradeType) {
    return UPGRADES_CONFIG[upgradeType] || {};
}

/**
 * Get next upgrade tier
 */
export function getNextUpgrade(upgradeType, currentTier) {
    const upgrades = UPGRADES_CONFIG[upgradeType];
    if (!upgrades) return null;

    const tiers = Object.keys(upgrades);
    const currentIndex = tiers.indexOf(String(currentTier));

    if (currentIndex === -1 || currentIndex === tiers.length - 1) {
        return null; // No next upgrade
    }

    return upgrades[tiers[currentIndex + 1]];
}

/**
 * Check if upgrade is available for purchase
 */
export function canPurchaseUpgrade(upgradeType, tier, currentTier, coins) {
    const upgrade = getUpgradeConfig(upgradeType, tier);
    if (!upgrade) return false;

    // Can't purchase if already owned
    if (tier === currentTier) return false;

    // Can't purchase if not enough coins
    if (coins < upgrade.cost) return false;

    // For watering can: must purchase in order (basic -> copper -> steel)
    if (upgradeType === 'wateringCan') {
        const tiers = ['basic', 'copper', 'steel'];
        const currentIndex = tiers.indexOf(currentTier);
        const targetIndex = tiers.indexOf(tier);

        // Can only purchase the next tier
        return targetIndex === currentIndex + 1;
    }

    // For inventory: must purchase in order (12 -> 24 -> 48)
    if (upgradeType === 'inventorySize') {
        const tiers = [12, 24, 48];
        const currentIndex = tiers.indexOf(Number(currentTier));
        const targetIndex = tiers.indexOf(Number(tier));

        // Can only purchase the next tier
        return targetIndex === currentIndex + 1;
    }

    return true;
}
