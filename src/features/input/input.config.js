/**
 * Input Configuration
 * 
 * Defines input system settings for the virtual joystick and touch controls.
 */

// Get responsive joystick size based on screen width
const getJoystickSize = () => {
    if (typeof window === 'undefined') return { outer: 60, inner: 25, max: 50 };

    const width = window.innerWidth;
    if (width < 640) { // Mobile
        return { outer: 50, inner: 20, max: 40 };
    } else if (width < 1024) { // Tablet
        return { outer: 55, inner: 22, max: 45 };
    } else { // Desktop
        return { outer: 60, inner: 25, max: 50 };
    }
};

const joystickSize = getJoystickSize();

export const INPUT_CONFIG = {
    // Virtual Joystick Settings
    JOYSTICK: {
        // Position (bottom-left corner, adjusted to avoid HUD)
        POSITION: {
            bottom: 20,
            left: 220, // Moved further right to clear HUD panel (was 140)
        },

        // Sizes (responsive)
        OUTER_RADIUS: joystickSize.outer, // Outer circle radius in pixels
        INNER_RADIUS: joystickSize.inner, // Inner circle (knob) radius in pixels
        MAX_DISTANCE: joystickSize.max, // Maximum distance the knob can move from center

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
