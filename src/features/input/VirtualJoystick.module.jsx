import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/state/store';
import { INPUT_CONFIG } from './input.config';

/**
 * VirtualJoystick Component
 * 
 * Touch-based joystick for player movement.
 * Renders in bottom-left corner with outer/inner circles.
 * Emits normalized direction vector (-1 to 1) via custom events.
 * 
 * Requirements: 1.8.1, 1.8.2, 1.8.6
 */
function VirtualJoystick() {
    const [isActive, setIsActive] = useState(false);
    const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
    const outerRef = useRef(null);
    const touchIdRef = useRef(null);
    const centerRef = useRef({ x: 0, y: 0 });

    const { JOYSTICK } = INPUT_CONFIG;

    // Track user interactions for auto-reset system
    const updateInteraction = useStore((s) => s.session.updateInteraction);

    // Calculate center position on mount and resize
    useEffect(() => {
        const updateCenter = () => {
            if (outerRef.current) {
                const rect = outerRef.current.getBoundingClientRect();
                centerRef.current = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };
            }
        };

        updateCenter();
        window.addEventListener('resize', updateCenter);
        return () => window.removeEventListener('resize', updateCenter);
    }, []);

    // Calculate normalized direction from knob position
    const calculateDirection = useCallback((x, y) => {
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = JOYSTICK.MAX_DISTANCE;

        if (distance < JOYSTICK.DEAD_ZONE * maxDistance) {
            return { x: 0, y: 0, magnitude: 0 };
        }

        const normalizedX = x / maxDistance;
        const normalizedY = y / maxDistance;
        const magnitude = Math.min(distance / maxDistance, 1);

        return {
            x: normalizedX,
            y: normalizedY,
            magnitude,
        };
    }, [JOYSTICK.DEAD_ZONE, JOYSTICK.MAX_DISTANCE]);

    // Emit custom event with joystick direction
    const emitDirection = useCallback((direction) => {
        const event = new CustomEvent('joystick-move', {
            detail: direction,
        });
        window.dispatchEvent(event);
    }, []);

    // Handle touch start
    const handleTouchStart = useCallback((e) => {
        updateInteraction(); // Track interaction for auto-reset

        const touch = e.touches[0];
        touchIdRef.current = touch.identifier;
        setIsActive(true);

        // Calculate initial position
        const deltaX = touch.clientX - centerRef.current.x;
        const deltaY = touch.clientY - centerRef.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = JOYSTICK.MAX_DISTANCE;

        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            setKnobPosition({
                x: Math.cos(angle) * maxDistance,
                y: Math.sin(angle) * maxDistance,
            });
        } else {
            setKnobPosition({ x: deltaX, y: deltaY });
        }

        const direction = calculateDirection(deltaX, deltaY);
        emitDirection(direction);
    }, [JOYSTICK.MAX_DISTANCE, calculateDirection, emitDirection, updateInteraction]);

    // Handle touch move
    const handleTouchMove = useCallback((e) => {
        if (!isActive) return;

        const touch = Array.from(e.touches).find(
            (t) => t.identifier === touchIdRef.current
        );
        if (!touch) return;

        const deltaX = touch.clientX - centerRef.current.x;
        const deltaY = touch.clientY - centerRef.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = JOYSTICK.MAX_DISTANCE;

        let newX = deltaX;
        let newY = deltaY;

        // Constrain to max distance
        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            newX = Math.cos(angle) * maxDistance;
            newY = Math.sin(angle) * maxDistance;
        }

        setKnobPosition({ x: newX, y: newY });

        const direction = calculateDirection(newX, newY);
        emitDirection(direction);
    }, [isActive, JOYSTICK.MAX_DISTANCE, calculateDirection, emitDirection]);

    // Handle touch end
    const handleTouchEnd = useCallback((e) => {
        const touch = Array.from(e.changedTouches).find(
            (t) => t.identifier === touchIdRef.current
        );
        if (!touch) return;

        setIsActive(false);
        setKnobPosition({ x: 0, y: 0 });
        touchIdRef.current = null;

        // Emit zero direction
        emitDirection({ x: 0, y: 0, magnitude: 0 });
    }, [emitDirection]);

    // Mouse events for desktop testing
    const handleMouseDown = useCallback((e) => {
        updateInteraction(); // Track interaction for auto-reset

        setIsActive(true);

        const rect = outerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = JOYSTICK.MAX_DISTANCE;

        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            setKnobPosition({
                x: Math.cos(angle) * maxDistance,
                y: Math.sin(angle) * maxDistance,
            });
        } else {
            setKnobPosition({ x: deltaX, y: deltaY });
        }

        const direction = calculateDirection(deltaX, deltaY);
        emitDirection(direction);
    }, [JOYSTICK.MAX_DISTANCE, calculateDirection, emitDirection, updateInteraction]);

    const handleMouseMove = useCallback((e) => {
        if (!isActive) return;

        const rect = outerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = JOYSTICK.MAX_DISTANCE;

        let newX = deltaX;
        let newY = deltaY;

        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            newX = Math.cos(angle) * maxDistance;
            newY = Math.sin(angle) * maxDistance;
        }

        setKnobPosition({ x: newX, y: newY });

        const direction = calculateDirection(newX, newY);
        emitDirection(direction);
    }, [isActive, JOYSTICK.MAX_DISTANCE, calculateDirection, emitDirection]);

    const handleMouseUp = useCallback(() => {
        setIsActive(false);
        setKnobPosition({ x: 0, y: 0 });
        emitDirection({ x: 0, y: 0, magnitude: 0 });
    }, [emitDirection]);

    // Add mouse event listeners
    useEffect(() => {
        if (isActive) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isActive, handleMouseMove, handleMouseUp]);

    return (
        <div
            className="fixed pointer-events-auto"
            style={{
                bottom: `${JOYSTICK.POSITION.bottom}px`,
                left: `${JOYSTICK.POSITION.left}px`,
                zIndex: 900, /* Below UI panels (1000) but above canvas */
            }}
        >
            {/* Outer Circle */}
            <div
                ref={outerRef}
                className="relative cursor-pointer select-none"
                style={{
                    width: `${JOYSTICK.OUTER_RADIUS * 2}px`,
                    height: `${JOYSTICK.OUTER_RADIUS * 2}px`,
                    borderRadius: '50%',
                    backgroundColor: JOYSTICK.OUTER_COLOR,
                    border: `3px solid ${JOYSTICK.OUTER_BORDER}`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
            >
                {/* Inner Circle (Knob) */}
                <motion.div
                    className="absolute"
                    style={{
                        width: `${JOYSTICK.INNER_RADIUS * 2}px`,
                        height: `${JOYSTICK.INNER_RADIUS * 2}px`,
                        borderRadius: '50%',
                        backgroundColor: JOYSTICK.INNER_COLOR,
                        border: `2px solid ${JOYSTICK.INNER_BORDER}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                        top: '50%',
                        left: '50%',
                        marginTop: `-${JOYSTICK.INNER_RADIUS}px`,
                        marginLeft: `-${JOYSTICK.INNER_RADIUS}px`,
                    }}
                    animate={{
                        x: knobPosition.x,
                        y: knobPosition.y,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                    }}
                />

                {/* Center Dot (visual reference) */}
                <div
                    className="absolute"
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        top: '50%',
                        left: '50%',
                        marginTop: '-3px',
                        marginLeft: '-3px',
                    }}
                />
            </div>

            {/* Debug Info (dev only) */}
            {import.meta.env.DEV && isActive && (
                <div
                    className="absolute top-0 left-full ml-4 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                    style={{ pointerEvents: 'none' }}
                >
                    <div>X: {knobPosition.x.toFixed(1)}</div>
                    <div>Y: {knobPosition.y.toFixed(1)}</div>
                    <div>
                        Dir: {calculateDirection(knobPosition.x, knobPosition.y).x.toFixed(2)},{' '}
                        {calculateDirection(knobPosition.x, knobPosition.y).y.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default VirtualJoystick;
