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
        spacing: 1.0, // Distance between chickens (in world units)

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

// Chicken spawn positions - near the scarecrow (at x=6.5, z=1.5)
// Placed just below the scarecrow in the grass, outside the farm grid
// Farm grid spans x=-3.5 to x=4.5, so x=5.5+ is safely in the grass
export const CHICKEN_POSITIONS = [
    { x: 5.8, y: 2.5 },
    { x: 6.8, y: 2.8 },
];

// Maximum number of chickens allowed
export const MAX_CHICKENS = 2;
