/**
 * Crops Configuration
 * 
 * Defines crop types, growth stages, values, and educational content.
 * Requirements: 1.4.1, 1.4.2, 1.7.2
 */

export const CROPS_CONFIG = {
    // Crop types (matching requirements)
    CROP_TYPES: {
        WHEAT: 'wheat',
        CARROT: 'carrot',
        TOMATO: 'tomato',
        BEAN: 'bean',
    },

    // Growth stages
    GROWTH_STAGES: {
        SEEDLING: 1,
        YOUNG: 2,
        MATURE: 3,
        READY: 4,
    },

    // Crop definitions
    CROPS: {
        wheat: {
            id: 'wheat',
            name: 'Wheat',
            icon: '🌾',
            growthHours: 2, // Hours to reach each stage (changed from days)
            stages: 4,
            coinValue: 10,

            // Educational content
            education: {
                title: 'Wheat: The Staff of Life',
                description: 'Wheat has been cultivated for over 10,000 years and is one of the most important crops in human history. It provides about 20% of the calories consumed worldwide and is a staple food in many cultures.',
                origin: 'First domesticated in the Fertile Crescent (modern-day Middle East) around 8,000 BCE',
                nutrition: 'Rich in carbohydrates, fiber, B vitamins, and minerals like iron and magnesium. Whole wheat provides more nutrients than refined wheat.',
                sustainability: 'Wheat is relatively water-efficient compared to other grains. Crop rotation with wheat helps prevent soil depletion and reduces pest problems.',
                facts: [
                    'Wheat provides 20% of calories consumed worldwide',
                    'Takes 90-120 days to grow in real life',
                    'Requires well-drained soil and full sun',
                    'Ancient Egyptians were among the first to cultivate wheat',
                    'There are over 25,000 varieties of wheat grown globally',
                ],
                image: '/sprites/crops/wheat-info.png', // Optional
            },

            // Sprite paths for each growth stage
            sprites: {
                1: '🌱', // Seedling - emoji fallback
                2: '🌿', // Young plant
                3: '🌾', // Mature
                4: '🌾', // Ready to harvest (golden)
            },
        },

        carrot: {
            id: 'carrot',
            name: 'Carrot',
            icon: '🥕',
            growthHours: 2, // Hours to reach each stage (changed from days)
            stages: 4,
            coinValue: 15,

            education: {
                title: 'Carrots: Orange Powerhouses',
                description: 'Carrots are rich in beta-carotene, which the body converts to vitamin A. They were originally purple, not orange! Dutch farmers in the 17th century bred orange carrots to honor their royal family.',
                origin: 'Native to Afghanistan and Persia, cultivated for over 5,000 years. Orange carrots were developed in the Netherlands in the 1600s.',
                nutrition: 'Excellent source of vitamin A (beta-carotene), vitamin K, potassium, and antioxidants. One medium carrot provides over 200% of daily vitamin A needs.',
                sustainability: 'Carrots are cool-season crops that grow well in many climates. They help break up compacted soil with their deep taproots, improving soil structure for future crops.',
                facts: [
                    'Originally purple, not orange!',
                    'Takes 70-80 days to mature in real life',
                    'Grows best in loose, sandy soil',
                    'Rich in vitamin A and antioxidants',
                    'The greens are edible and nutritious too',
                ],
                image: '/sprites/crops/carrot-info.png',
            },

            sprites: {
                1: '🌱',
                2: '🌿',
                3: '🥕',
                4: '🥕',
            },
        },

        tomato: {
            id: 'tomato',
            name: 'Tomato',
            icon: '🍅',
            growthHours: 3, // Hours to reach each stage (changed from days)
            stages: 4,
            coinValue: 20,

            education: {
                title: 'Tomatoes: Fruit or Vegetable?',
                description: 'Botanically a fruit, culinarily a vegetable. Tomatoes are native to South America and were brought to Europe in the 16th century. They were once thought to be poisonous in Europe!',
                origin: 'Native to western South America (Peru and Ecuador). Domesticated by the Aztecs and Incas around 700 CE, introduced to Europe by Spanish conquistadors.',
                nutrition: 'Excellent source of vitamin C, potassium, folate, and lycopene (a powerful antioxidant). Cooking tomatoes increases lycopene availability.',
                sustainability: 'Tomatoes are heavy feeders that benefit from compost. They can be grown vertically to save space and improve air circulation, reducing disease. Companion planting with basil helps repel pests naturally.',
                facts: [
                    'Native to South America',
                    'Takes 60-85 days to produce fruit in real life',
                    'Needs support structures as they grow',
                    'Rich in lycopene, a powerful antioxidant',
                    'There are over 10,000 varieties worldwide',
                ],
                image: '/sprites/crops/tomato-info.png',
            },

            sprites: {
                1: '🌱',
                2: '🌿',
                3: '🍅',
                4: '🍅',
            },
        },

        bean: {
            id: 'bean',
            name: 'Bean',
            icon: '🫘',
            growthHours: 3, // Hours to reach each stage (changed from days)
            stages: 4,
            coinValue: 25,

            education: {
                title: 'Beans: Nitrogen Fixers',
                description: 'Beans improve soil health by fixing nitrogen from the air into the soil through a symbiotic relationship with bacteria. This makes them excellent companion plants and reduces the need for synthetic fertilizers.',
                origin: 'Domesticated independently in both the Americas and Asia over 7,000 years ago. Part of the "Three Sisters" planting method used by Native Americans.',
                nutrition: 'Excellent source of plant-based protein, fiber, folate, iron, and complex carbohydrates. One cup provides about 15g of protein and 13g of fiber.',
                sustainability: 'Beans are nitrogen-fixing legumes that enrich soil naturally, reducing fertilizer needs. They require less water than many crops and improve soil structure. Perfect for crop rotation and sustainable farming.',
                facts: [
                    'Adds nitrogen back to the soil naturally',
                    'Takes 50-60 days to harvest in real life',
                    'Excellent source of plant protein',
                    'Part of the legume family',
                    'Used in the "Three Sisters" companion planting method',
                ],
                image: '/sprites/crops/bean-info.png',
            },

            sprites: {
                1: '🌱',
                2: '🌿',
                3: '🫘',
                4: '🫘',
            },
        },
    },

    // Watering requirements
    WATERING: {
        REQUIRED_FOR_GROWTH: false, // Crops can grow without water, but slower
        WATERED_GROWTH_MULTIPLIER: 1.5, // Watered crops grow 1.5x faster
        HOURS_WITHOUT_WATER_BEFORE_WITHER: 4, // Show "Needs Water!" warning
        HOURS_WITHOUT_WATER_BEFORE_DEATH: 8, // Crop dies completely (can only be removed)
        WITHER_STAGE_PENALTY: 0, // No stage penalty - crops keep growing even when withered
    },
};

/**
 * Get crop configuration by ID
 */
export function getCropById(cropId) {
    return CROPS_CONFIG.CROPS[cropId] || null;
}

/**
 * Get all available crops
 */
export function getAllCrops() {
    return Object.values(CROPS_CONFIG.CROPS);
}

/**
 * Get crop value (coins earned on harvest)
 */
export function getCropValue(cropId) {
    const crop = getCropById(cropId);
    return crop ? crop.coinValue : 0;
}

/**
 * Get crop growth time (hours to reach next stage)
 */
export function getCropGrowthHours(cropId) {
    const crop = getCropById(cropId);
    return crop ? crop.growthHours : 2;
}

/**
 * Get crop sprite for stage
 */
export function getCropSprite(cropId, stage) {
    const crop = getCropById(cropId);
    if (!crop) return '🌱';
    return crop.sprites[stage] || crop.sprites[1];
}
