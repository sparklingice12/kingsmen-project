import { useRef, useMemo, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PlayerSprite Component
 * 
 * Renders the player character as a sprite in 3D space using farmer.png sprite sheet.
 * Extracts a single frame from the 4x4 sprite sheet.
 * 
 * Note: The sprite sheet should have a transparent background (not pink).
 * 
 * @param {Object} props
 * @param {Array} props.position - [x, y, z] position in 3D space
 * @param {string} props.direction - Current facing direction (up, down, left, right)
 */
function PlayerSpriteInner({ position = [0, 0.5, 0], direction = 'down' }) {
    const meshRef = useRef();

    // Load the farmer sprite sheet texture
    const spriteSheet = useLoader(THREE.TextureLoader, '/sprites/farmer.png');

    // Create sprite material with a single frame from the sprite sheet
    const material = useMemo(() => {
        // Clone the texture to avoid modifying the original
        const texture = spriteSheet.clone();
        texture.needsUpdate = true;

        // Configure texture for pixel-perfect rendering
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        // Sprite sheet is 4x4 grid (16 frames total)
        // Each frame is 1/4 of the texture width/height
        const frameWidth = 1 / 4;
        const frameHeight = 1 / 4;

        // Direction mapping to sprite sheet positions
        // Row 0: down-facing frames
        // Row 1: up-facing frames  
        // Row 2: left-facing frames
        // Row 3: right-facing frames
        const directionMap = {
            down: { row: 0, col: 1 },  // Second frame in first row (idle down)
            up: { row: 1, col: 1 },    // Second frame in second row (idle up)
            left: { row: 2, col: 1 },  // Second frame in third row (idle left)
            right: { row: 3, col: 1 }, // Second frame in fourth row (idle right)
        };

        const frame = directionMap[direction] || directionMap.down;

        // Set texture offset and repeat to show only one frame
        texture.offset.x = frame.col * frameWidth;
        texture.offset.y = 1 - (frame.row + 1) * frameHeight; // Flip Y coordinate
        texture.repeat.set(frameWidth, frameHeight);

        return new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1, // Discard pixels with alpha below 0.1
            depthWrite: false,
        });
    }, [spriteSheet, direction]);

    return (
        <sprite
            ref={meshRef}
            position={position}
            material={material}
            scale={[1.2, 1.2, 1]}
        />
    );
}

// Wrap with Suspense to handle loading states
function PlayerSprite(props) {
    return (
        <Suspense fallback={null}>
            <PlayerSpriteInner {...props} />
        </Suspense>
    );
}

export default PlayerSprite;
