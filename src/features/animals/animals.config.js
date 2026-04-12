/**
 * Animal System Configuration
 * Defines chicken properties, animations, and educational content
 */

export const ANIMALS_CONFIG = {
    chicken: {
        name: 'Chicken',
        spriteSize: 32, // 32×32 pixels
        eggValue: 30, // coins per egg
        feedCost: 0, // free to feed (uses existing crops)

        // Sprite sheet configuration (2×2 grid: idle and eating animations)
        spriteSheet: {
            path: '/sprites/animals/chicken-spritesheet.png',
            frameWidth: 32,
            frameHeight: 32,
            columns: 2,
            rows: 2,
        },

        // Animation definitions
        animations: {
            idle: {
                frames: [0, 1], // First row
                fps: 2, // Slow idle animation
            },
            eating: {
                frames: [2, 3], // Second row
                fps: 4, // Faster eating animation
            },
        },

        // Educational content
        educationalContent: {
            title: 'Chickens: Farm Companions',
            description: 'Chickens have been domesticated for over 8,000 years and are one of the most common farm animals worldwide. They provide eggs, meat, and help control pests in gardens.',
            facts: [
                'A healthy hen can lay 250-300 eggs per year',
                'Chickens are omnivores and eat grains, insects, and vegetables',
                'Free-range chickens produce eggs with richer nutrients',
                'Chickens help fertilize soil with their droppings',
                'They can live 5-10 years with proper care',
            ],
            sustainability: 'Backyard chickens reduce food waste by eating scraps and provide fresh, local eggs with a lower carbon footprint than store-bought eggs.',
        },
    },
};

// Chicken spawn positions - near scarecrow in top-right grass area
// Scarecrow is at position [6.5, 0.5, 1.5]
// Placing chickens in the grass area around the scarecrow
export const CHICKEN_POSITIONS = [
    { x: 5.5, y: 0.5 }, // Left of scarecrow
    { x: 7.5, y: 0.5 }, // Right of scarecrow
];

// Maximum number of chickens allowed
export const MAX_CHICKENS = 2;
