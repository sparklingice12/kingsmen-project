import { useRef, useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useInput } from '@/features/input';
import { INPUT_CONFIG } from '@/features/input/input.config';
import PlayerSprite from './PlayerSprite';

/**
 * Player Component
 * 
 * Manages the player character state and renders the sprite.
 * Handles position, direction, and animation state.
 * Uses Rapier.js physics for collision detection.
 * Connected to virtual joystick for movement input.
 * 
 * Requirements: 1.2.2, 1.2.5
 */
function Player() {
    const rigidBodyRef = useRef();
    const [direction, setDirection] = useState('down');

    // Get joystick input
    const { direction: inputDirection, isMoving } = useInput();

    // Movement speed from config (3 tiles/second)
    const speed = INPUT_CONFIG.MOVEMENT.SPEED;

    // Update player movement based on joystick input
    useFrame((state, delta) => {
        if (!rigidBodyRef.current) return;

        // Calculate velocity based on joystick direction
        const velocity = {
            x: inputDirection.x * speed,
            y: 0, // No vertical movement (top-down game)
            z: inputDirection.y * speed, // Y input maps to Z axis in 3D space
        };

        // Apply velocity to physics body
        rigidBodyRef.current.setLinvel(velocity, true);

        // Update sprite direction based on movement
        if (isMoving) {
            // Determine primary direction based on larger component
            if (Math.abs(inputDirection.x) > Math.abs(inputDirection.y)) {
                setDirection(inputDirection.x > 0 ? 'right' : 'left');
            } else {
                setDirection(inputDirection.y > 0 ? 'down' : 'up');
            }
        }
    });

    return (
        <RigidBody
            ref={rigidBodyRef}
            type="dynamic"
            position={[0, 0.5, 0]}
            lockRotations
            linearDamping={5}
            angularDamping={5}
            enabledRotations={[false, false, false]}
        >
            {/* Collider shape - explicit cuboid collider */}
            <CuboidCollider args={[0.3, 0.4, 0.3]} />

            {/* Player Sprite (visual only) */}
            <PlayerSprite position={[0, 0, 0]} direction={direction} />
        </RigidBody>
    );
}

export default Player;
