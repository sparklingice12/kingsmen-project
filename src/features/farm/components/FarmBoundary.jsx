import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * FarmBoundary Component
 * 
 * Renders visual wooden fences around the 8×8 farm grid.
 * Uses horizontal planes (visible from top-down view).
 * Stardew Valley-inspired pixel art style.
 */
function FarmBoundary() {
    const gridSize = 8;
    const halfSize = gridSize / 2;
    const fenceWidth = 0.4; // Width of fence border

    // Create fence texture (simple wooden fence pattern)
    const fenceTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#3a2515';
        ctx.fillRect(0, 0, 128, 128);

        ctx.fillStyle = '#4a3020';
        for (let i = 0; i < 8; i++) {
            const x = i * 16;
            ctx.fillRect(x + 2, 0, 12, 128);
        }

        ctx.fillStyle = '#2e1a0e';
        for (let i = 0; i < 8; i++) {
            const x = i * 16;
            ctx.fillRect(x, 0, 2, 128);
        }

        ctx.fillStyle = '#b09060';
        ctx.fillRect(0, 60, 128, 3);
        ctx.fillRect(0, 90, 128, 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        return texture;
    }, []);

    return (
        <group>
            {/* North Fence (top) - horizontal plane */}
            <mesh
                position={[0, 0.15, -halfSize - fenceWidth / 2]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[gridSize + fenceWidth * 2, fenceWidth]} />
                <meshBasicMaterial
                    map={fenceTexture}
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>

            {/* South Fence (bottom) - horizontal plane */}
            <mesh
                position={[0, 0.15, halfSize + fenceWidth / 2]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[gridSize + fenceWidth * 2, fenceWidth]} />
                <meshBasicMaterial
                    map={fenceTexture}
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>

            {/* West Fence (left) - horizontal plane */}
            <mesh
                position={[-halfSize - fenceWidth / 2, 0.15, 0]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            >
                <planeGeometry args={[gridSize, fenceWidth]} />
                <meshBasicMaterial
                    map={fenceTexture}
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>

            {/* East Fence (right) - horizontal plane */}
            <mesh
                position={[halfSize + fenceWidth / 2, 0.15, 0]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            >
                <planeGeometry args={[gridSize, fenceWidth]} />
                <meshBasicMaterial
                    map={fenceTexture}
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>

            {/* Corner Posts */}
            {/* Top-Left */}
            <mesh
                position={[-halfSize - fenceWidth / 2, 0.15, -halfSize - fenceWidth / 2]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[fenceWidth, fenceWidth]} />
                <meshBasicMaterial
                    color="#2e1a0e"
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>

            {/* Top-Right */}
            <mesh
                position={[halfSize + fenceWidth / 2, 0.15, -halfSize - fenceWidth / 2]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[fenceWidth, fenceWidth]} />
                <meshBasicMaterial
                    color="#2e1a0e"
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>

            {/* Bottom-Left */}
            <mesh
                position={[-halfSize - fenceWidth / 2, 0.15, halfSize + fenceWidth / 2]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[fenceWidth, fenceWidth]} />
                <meshBasicMaterial
                    color="#2e1a0e"
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>

            {/* Bottom-Right */}
            <mesh
                position={[halfSize + fenceWidth / 2, 0.15, halfSize + fenceWidth / 2]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[fenceWidth, fenceWidth]} />
                <meshBasicMaterial
                    color="#2e1a0e"
                    side={THREE.DoubleSide}
                    transparent={false}
                />
            </mesh>
        </group>
    );
}

export default FarmBoundary;
