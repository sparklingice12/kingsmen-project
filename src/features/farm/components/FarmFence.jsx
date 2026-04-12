import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * FarmFence Component
 * 
 * Renders decorative fence boundary around the farm grid.
 * Uses bamboo fence sprites for authentic Filipino farm aesthetic.
 */

function FenceSprite({ position, texture, size = [1, 1], rotation = 0, frameIndex = 0, totalFrames = 1, framesPerRow = 2 }) {
    const clonedTexture = useMemo(() => {
        if (!texture) return null;
        const clone = texture.clone();
        clone.needsUpdate = true;
        clone.magFilter = THREE.NearestFilter;
        clone.minFilter = THREE.NearestFilter;

        if (totalFrames > 1) {
            // Calculate UV coordinates for sprite sheet frame
            const col = frameIndex % framesPerRow;
            const row = Math.floor(frameIndex / framesPerRow);
            const rows = Math.ceil(totalFrames / framesPerRow);

            clone.repeat.set(1 / framesPerRow, 1 / rows);
            // Standard UV mapping (no Y flip needed for corners)
            clone.offset.set(col / framesPerRow, row / rows);
        }

        return clone;
    }, [texture, frameIndex, totalFrames, framesPerRow]);

    if (!clonedTexture) return null;

    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]}>
            <planeGeometry args={size} />
            <meshBasicMaterial
                map={clonedTexture}
                transparent
                alphaTest={0.1}
            />
        </mesh>
    );
}

function FarmFence() {
    // Load fence textures
    const [
        horizontalTexture,
        verticalTexture,
        cornerTexture,
        gateTexture,
        postTexture
    ] = useTexture([
        '/sprites/farm/fence-horizontal.png',
        '/sprites/farm/fence-vertical.png',
        '/sprites/farm/fence-corners.png',
        '/sprites/farm/fence-gate.png',
        '/sprites/farm/fence-post.png',
    ]);

    // Farm grid is 8x8 tiles, each tile is 1 unit
    // Grid center is at (0, 0), so grid spans from -4 to 4 in both X and Z
    // Fence should be positioned closer to the grid edge
    const GRID_SIZE = 8;
    const TILE_SIZE = 1;
    const FENCE_OFFSET = 0.3; // Closer to grid edge
    const FENCE_Y = -0.015; // Slightly above ground

    const gridMin = -(GRID_SIZE / 2) * TILE_SIZE;
    const gridMax = (GRID_SIZE / 2) * TILE_SIZE;

    const fenceMin = gridMin - FENCE_OFFSET;
    const fenceMax = gridMax + FENCE_OFFSET;

    // Horizontal fence pieces (top and bottom)
    const horizontalFences = useMemo(() => {
        const fences = [];
        const pieceWidth = 0.8; // Smaller width for better fit
        const numPieces = Math.ceil((fenceMax - fenceMin) / pieceWidth);

        // Top edge - avoid corners
        const cornerOffset = 0.3; // Space for corner pieces
        for (let i = 0; i < numPieces; i++) {
            const x = fenceMin + i * pieceWidth + pieceWidth / 2;
            // Only place if not overlapping with corners
            if (x > fenceMin + cornerOffset && x < fenceMax - cornerOffset) {
                fences.push({
                    position: [x, FENCE_Y, fenceMin],
                    size: [pieceWidth, 0.4],
                    rotation: 0
                });
            }
        }

        // Bottom edge (skip center pieces for gate)
        const gateWidth = 1.2;
        const gateStart = -gateWidth / 2;
        const gateEnd = gateWidth / 2;

        for (let i = 0; i < numPieces; i++) {
            const x = fenceMin + i * pieceWidth + pieceWidth / 2;
            // Skip pieces where gate will be AND avoid corners
            if ((x < gateStart || x > gateEnd) && x > fenceMin + cornerOffset && x < fenceMax - cornerOffset) {
                fences.push({
                    position: [x, FENCE_Y, fenceMax],
                    size: [pieceWidth, 0.4],
                    rotation: 0
                });
            }
        }

        return fences;
    }, [fenceMin, fenceMax, FENCE_Y]);

    // Vertical fence pieces (left and right)
    const verticalFences = useMemo(() => {
        const fences = [];
        const pieceHeight = 0.8; // Smaller height for better fit
        const numPieces = Math.ceil((fenceMax - fenceMin) / pieceHeight);

        // Left edge - avoid corners
        const cornerOffset = 0.3; // Space for corner pieces
        for (let i = 0; i < numPieces; i++) {
            const z = fenceMin + i * pieceHeight + pieceHeight / 2;
            // Only place if not overlapping with corners
            if (z > fenceMin + cornerOffset && z < fenceMax - cornerOffset) {
                fences.push({
                    position: [fenceMin, FENCE_Y, z],
                    size: [0.4, pieceHeight],
                    rotation: Math.PI / 2
                });
            }
        }

        // Right edge - avoid corners
        for (let i = 0; i < numPieces; i++) {
            const z = fenceMin + i * pieceHeight + pieceHeight / 2;
            // Only place if not overlapping with corners
            if (z > fenceMin + cornerOffset && z < fenceMax - cornerOffset) {
                fences.push({
                    position: [fenceMax, FENCE_Y, z],
                    size: [0.4, pieceHeight],
                    rotation: Math.PI / 2
                });
            }
        }

        return fences;
    }, [fenceMin, fenceMax, FENCE_Y]);

    // Corner pieces - sprite sheet with 4 frames (2x2 layout)
    // Add rotation to make bottom corners face inward
    const corners = useMemo(() => [
        { position: [fenceMin, FENCE_Y, fenceMin], frameIndex: 0, rotation: 0 }, // Top-left corner
        { position: [fenceMax, FENCE_Y, fenceMin], frameIndex: 1, rotation: 0 }, // Top-right corner  
        { position: [fenceMin, FENCE_Y, fenceMax], frameIndex: 0, rotation: Math.PI / 2 }, // Bottom-left corner (90°)
        { position: [fenceMax, FENCE_Y, fenceMax], frameIndex: 1, rotation: Math.PI + Math.PI / 2 }, // Bottom-right corner (270°)
    ], [fenceMin, fenceMax, FENCE_Y]);

    // Gate at bottom center
    const gate = useMemo(() => ({
        position: [0, FENCE_Y, fenceMax],
        size: [1.2, 0.8]
    }), [fenceMax, FENCE_Y]);

    // Decorative posts at corners
    const posts = useMemo(() => [
        { position: [fenceMin, FENCE_Y, fenceMin] },
        { position: [fenceMax, FENCE_Y, fenceMin] },
        { position: [fenceMin, FENCE_Y, fenceMax] },
        { position: [fenceMax, FENCE_Y, fenceMax] },
    ], [fenceMin, fenceMax]);

    return (
        <group name="farm-fence">
            {/* Horizontal fence pieces */}
            {horizontalFences.map((fence, i) => (
                <FenceSprite
                    key={`h-fence-${i}`}
                    position={fence.position}
                    texture={horizontalTexture}
                    size={fence.size}
                    rotation={fence.rotation}
                />
            ))}

            {/* Vertical fence pieces */}
            {verticalFences.map((fence, i) => (
                <FenceSprite
                    key={`v-fence-${i}`}
                    position={fence.position}
                    texture={verticalTexture}
                    size={fence.size}
                    rotation={fence.rotation}
                />
            ))}

            {/* Corner pieces - using sprite sheet with rotation */}
            {corners.map((corner, i) => (
                <FenceSprite
                    key={`corner-${i}`}
                    position={corner.position}
                    texture={cornerTexture}
                    size={[0.6, 0.6]}
                    rotation={corner.rotation}
                    frameIndex={corner.frameIndex}
                    totalFrames={4}
                    framesPerRow={2}
                />
            ))}

            {/* Gate at bottom center */}
            <FenceSprite
                position={gate.position}
                texture={gateTexture}
                size={gate.size}
                rotation={0}
            />

            {/* Decorative posts at corners */}
            {posts.map((post, i) => (
                <FenceSprite
                    key={`post-${i}`}
                    position={post.position}
                    texture={postTexture}
                    size={[0.4, 0.4]}
                    rotation={0}
                />
            ))}
        </group>
    );
}

export default FarmFence;
