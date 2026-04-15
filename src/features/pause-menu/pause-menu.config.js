/**
 * Pause Menu Configuration
 * Defines touch target sizes, colors, spacing, z-index layers, and animation timings
 */

export const PAUSE_MENU_CONFIG = {
    // Touch target sizes (Requirements 6.1, 6.2)
    touchTargets: {
        primary: 80, // Primary action buttons (Resume, Reset, etc.)
        secondary: 60, // Secondary action buttons (Back, Cancel)
        minimum: 44, // Absolute minimum for any interactive element
    },

    // Spacing and layout
    spacing: {
        buttonGap: 16, // Gap between adjacent buttons
        contentPadding: {
            mobile: 32,
            tablet: 48,
            desktop: 64,
        },
        sectionGap: 24, // Gap between sections in How to Play
    },

    // Modal dimensions
    modal: {
        width: {
            mobile: '90%',
            tablet: 600,
            desktop: 800,
        },
        maxHeight: '90vh',
        borderRadius: 16,
    },

    // Z-index layers (Requirements 1.5, 5.4)
    zIndex: {
        pauseButton: 50, // HUD button
        pauseMenu: 9998, // Main pause menu modal
        resetConfirmation: 9999, // Confirmation dialog above pause menu
        adminPanel: 9999, // Admin panel above pause menu
    },

    // Colors (Requirements 10.1, 10.2)
    colors: {
        // Background colors
        overlay: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark overlay
        modalBg: 'rgba(58, 37, 24, 0.98)', // Brown/tan modal background

        // Border colors
        border: '#b09060', // Gold/tan border
        borderHover: '#c4a06a', // Lighter gold on hover

        // Text colors
        text: '#e8d5b0', // Light tan text
        textMuted: '#b09060', // Muted tan text
        textDark: '#3a2515', // Dark brown text for light backgrounds

        // Button colors
        primary: {
            bg: 'linear-gradient(to right, #4a7c59, #3a6b49)', // Green gradient
            border: '#5a8c69',
            text: '#e8d5b0',
        },
        secondary: {
            bg: 'linear-gradient(to right, #4a3020, #3a2515)', // Brown gradient
            border: '#b09060',
            text: '#e8d5b0',
        },
        warning: {
            bg: 'linear-gradient(to right, #8c4a3a, #7c3a2a)', // Red gradient
            border: '#9c5a4a',
            text: '#e8d5b0',
        },
        subtle: {
            bg: 'linear-gradient(to right, #5a5a5a, #4a4a4a)', // Gray gradient
            border: '#6a6a6a',
            text: '#e8d5b0',
        },
    },

    // Animation timings (Requirements 10.7, 11.4)
    animations: {
        modalTransition: 300, // Modal open/close duration (ms)
        buttonTransition: 150, // Button hover/active duration (ms)
        fadeIn: 300, // Fade in duration (ms)
        scaleIn: 300, // Scale in duration (ms)
    },

    // Typography (Requirements 10.2, 3.10)
    typography: {
        fontFamily: {
            primary: 'Brother 1816, sans-serif',
            fallback: 'Neue Frutiger World, sans-serif',
        },
        fontSize: {
            heading: {
                mobile: 24,
                tablet: 28,
                desktop: 32,
            },
            body: {
                mobile: 16,
                tablet: 18,
                desktop: 20,
            },
            button: {
                mobile: 20,
                tablet: 24,
                desktop: 28,
            },
        },
        lineHeight: 1.6,
    },

    // Accessibility (Requirements 8.2, 8.6)
    accessibility: {
        focusOutlineWidth: 2,
        focusOutlineColor: '#b09060',
        focusOutlineOffset: 4,
        reducedMotionDuration: 0, // Disable animations when prefers-reduced-motion
    },

    // Button dimensions by screen size (Requirements 7.1, 7.2, 7.3)
    buttonHeight: {
        mobile: 70,
        tablet: 80,
        desktop: 100,
    },
};

/**
 * Get responsive button height based on screen width
 */
export function getButtonHeight(screenWidth) {
    if (screenWidth < 768) return PAUSE_MENU_CONFIG.buttonHeight.mobile;
    if (screenWidth < 1366) return PAUSE_MENU_CONFIG.buttonHeight.tablet;
    return PAUSE_MENU_CONFIG.buttonHeight.desktop;
}

/**
 * Get responsive font size based on screen width
 */
export function getFontSize(type, screenWidth) {
    const sizes = PAUSE_MENU_CONFIG.typography.fontSize[type];
    if (screenWidth < 768) return sizes.mobile;
    if (screenWidth < 1366) return sizes.tablet;
    return sizes.desktop;
}

/**
 * Get responsive content padding based on screen width
 */
export function getContentPadding(screenWidth) {
    if (screenWidth < 768) return PAUSE_MENU_CONFIG.spacing.contentPadding.mobile;
    if (screenWidth < 1366) return PAUSE_MENU_CONFIG.spacing.contentPadding.tablet;
    return PAUSE_MENU_CONFIG.spacing.contentPadding.desktop;
}
