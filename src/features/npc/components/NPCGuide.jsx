import { useRef, useMemo, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * NPCGuide Component
 * 
 * Renders a scarecrow NPC sprite in the R3F scene.
 * - Positioned at a fixed location on the farm (top-right corner)
 * - Uses scarecrow.png sprite sheet (4x4 grid)
 * - Clickable to show dialogue/quest information
 * 
 * Requirements: 2.4.1
 */
function NPCGuideInner({ onTap }) {
    const meshRef = useRef();

    // Load the scarecrow sprite sheet texture
    const spriteSheet = useLoader(THREE.TextureLoader, '/sprites/scarecrow.png');

    // Create scarecrow sprite material with single frame extraction
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

        // Use the idle down frame (row 0, col 1)
        const frame = { row: 0, col: 1 };

        // Set texture offset and repeat to show only one frame
        texture.offset.x = frame.col * frameWidth;
        texture.offset.y = 1 - (frame.row + 1) * frameHeight; // Flip Y coordinate
        texture.repeat.set(frameWidth, frameHeight);

        return new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            depthWrite: false,
        });
    }, [spriteSheet]);

    // Handle click/tap on NPC
    const handleClick = (e) => {
        e.stopPropagation();
        if (onTap) {
            onTap();
        }
    };

    return (
        <sprite
            ref={meshRef}
            position={[6.5, 0.5, 1.5]} // Fixed position: top-right area of farm
            scale={[0.8, 0.8, 1]}
            material={material}
            onClick={handleClick}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'default';
            }}
        />
    );
}

// Wrap with Suspense to handle loading states
function NPCGuide(props) {
    return (
        <Suspense fallback={null}>
            <NPCGuideInner {...props} />
        </Suspense>
    );
}

export default NPCGuide;
