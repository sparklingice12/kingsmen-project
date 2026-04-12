import { useState, useEffect, useCallback } from 'react';

/**
 * useInput Hook
 * 
 * Listens for joystick-move custom events and provides
 * normalized direction vector for player movement.
 * 
 * @returns {Object} { direction: {x, y}, magnitude, isMoving }
 */
export function useInput() {
    const [direction, setDirection] = useState({ x: 0, y: 0 });
    const [magnitude, setMagnitude] = useState(0);

    const handleJoystickMove = useCallback((event) => {
        const { x, y, magnitude: mag } = event.detail;
        setDirection({ x, y });
        setMagnitude(mag);
    }, []);

    useEffect(() => {
        window.addEventListener('joystick-move', handleJoystickMove);
        return () => {
            window.removeEventListener('joystick-move', handleJoystickMove);
        };
    }, [handleJoystickMove]);

    const isMoving = magnitude > 0;

    return {
        direction,
        magnitude,
        isMoving,
    };
}
