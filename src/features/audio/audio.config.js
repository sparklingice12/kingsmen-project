// Audio configuration for Heritage Harvest
export const audioConfig = {
    // Background music settings
    music: {
        enabled: true,
        defaultVolume: 0.3,
        fadeInDuration: 2000, // 2 seconds
        fadeOutDuration: 1000, // 1 second
        tracks: {
            farm: '/audio/music/farm-ambience.mp3',
            // Add more tracks as needed
        }
    },

    // Sound effects settings
    sfx: {
        enabled: true,
        defaultVolume: 0.7,
        sounds: {
            // Tool sounds
            till: '/audio/sfx/till.mp3',
            water: '/audio/sfx/water.mp3',
            plant: '/audio/sfx/plant.mp3',
            harvest: '/audio/sfx/harvest.mp3',

            // UI sounds
            click: '/audio/sfx/ui-click.mp3',
            hover: '/audio/sfx/ui-hover.mp3',
            success: '/audio/sfx/success.mp3',
            error: '/audio/sfx/error.mp3',

            // Game events
            dayTransition: '/audio/sfx/day-transition.mp3',
            cropGrowth: '/audio/sfx/crop-growth.mp3',
            coinEarn: '/audio/sfx/coin-earn.mp3',

            // Animal sounds
            chickenCluck: '/audio/sfx/chicken-cluck.mp3',

            // Nature ambience
            birds: '/audio/sfx/birds.mp3',
            wind: '/audio/sfx/wind.mp3'
        }
    },

    // Audio format preferences (fallbacks)
    formats: ['mp3', 'ogg', 'wav'],

    // Performance settings
    maxConcurrentSounds: 8,
    preloadCriticalSounds: true
};