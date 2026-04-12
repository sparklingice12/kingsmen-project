/**
 * Input Configuration
 * 
 * Defines input system settings for the virtual joystick and touch controls.
 */

export const INPUT_CONFIG = {
    // Virtual Joystick Settings
    JOYSTICK: {
        // Position (bottom-left corner)
        POSITION: {
            bottom: 40,
            left: 40,
        },

        // Sizes
        OUTER_RADIUS: 60, // Outer circle radius in pixels
        INNER_RADIUS: 25, // Inner circle (knob) radius in pixels
        MAX_DISTANCE: 50, // Maximum distance the knob can move from center

        // Visual styling
        OUTER_COLOR: 'rgba(255, 255, 255, 0.3)',
        OUTER_BORDER: 'rgba(255, 255, 255, 0.5)',
        INNER_COLOR: 'rgba(255, 255, 255, 0.7)',
        INNER_BORDER: 'rgba(255, 255, 255, 0.9)',

        // Behavior
        DEAD_ZONE: 0.15, // Ignore input below this threshold (0-1)
        RETURN_SPEED: 0.2, // Speed at which knob returns to center (0-1)
    },

    // Touch settings
    TOUCH: {
        MIN_DRAG_DISTANCE: 5, // Minimum pixels to register as drag
    },

    // Player movement
    MOVEMENT: {
        SPEED: 3, // Tiles per second
        ACCELERATION: 0.1, // How quickly player reaches max speed
        DECELERATION: 0.15, // How quickly player stops
    },
};
