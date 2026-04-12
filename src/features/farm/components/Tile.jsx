import { useMemo, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { FARM_CONFIG } from '../farm.config';
import * as THREE from 'three';

/**
 * Tile Component
 * 
 * Renders a single farm tile as a plane mesh in 3D space.
 * Uses PNG sprite textures with variations for visual diversity.
 * 
 * @param {Object} props
 * @param {Object} props.tile - Tile data from Zustand store
 */
function TileInner({ tile }) {
    // Load all untilled texture variations
    const untilled1 = useLoader(THREE.TextureLoader, '/sprites/land/untilled/untilled-1.png');
    const untilled2 = useLoader(THREE.TextureLoader, '/sprites/land/untilled/untilled-2.png');
    const untilled3 = useLoader(THREE.TextureLoader, '/sprites/land/untilled/untilled-3.png');

    // Load all tilled texture variations
    const tilled1 = useLoader(THREE.TextureLoader, '/sprites/land/tilled/tilled-1.png');
    const tilled2 = useLoader(THREE.TextureLoader, '/sprites/land/tilled/tilled-2.png');
    const tilled3 = useLoader(THREE.TextureLoader, '/sprites/land/tilled/tilled-3.png');

    // Load all watered texture variations
    const watered1 = useLoader(THREE.TextureLoader, '/sprites/land/watered/watered-1.png');
    const watered2 = useLoader(THREE.TextureLoader, '/sprites/land/watered/watered-2.png');
    const watered3 = useLoader(THREE.TextureLoader, '/sprites/land/watered/watered-3.png');

    // Select texture variation based on tile position (deterministic randomness)
    const textureVariation = useMemo(() => {
        // Use tile coordinates to deterministically select a variation
        const hash = (tile.row * 7 + tile.col * 13) % 3;
        return hash;
    }, [tile.row, tile.col]);

    // Get texture based on tile state
    const texture = useMemo(() => {
        let selectedTexture;

        switch (tile.state) {
            case FARM_CONFIG.TILE_STATES.UNTILLED:
                // Select from 3 variations
                if (textureVariation === 0) selectedTexture = untilled1;
                else if (textureVariation === 1) selectedTexture = untilled2;
                else selectedTexture = untilled3;
                break;
            case FARM_CONFIG.TILE_STATES.TILLED:
                // Select from 3 tilled variations
                if (textureVariation === 0) selectedTexture = tilled1;
                else if (textureVariation === 1) selectedTexture = tilled2;
                else selectedTexture = tilled3;
                break;
            case FARM_CONFIG.TILE_STATES.WATERED:
            case FARM_CONFIG.TILE_STATES.PLANTED:
            case FARM_CONFIG.TILE_STATES.GROWING:
            case FARM_CONFIG.TILE_STATES.READY:
                // Select from 3 watered variations
                if (textureVariation === 0) selectedTexture = watered1;
                else if (textureVariation === 1) selectedTexture = watered2;
                else selectedTexture = watered3;
                break;
            default:
                selectedTexture = untilled1;
        }

        // Clone and configure texture for pixel-perfect rendering
        const clonedTexture = selectedTexture.clone();
        clonedTexture.needsUpdate = true;
        clonedTexture.magFilter = THREE.NearestFilter;
        clonedTexture.minFilter = THREE.NearestFilter;
        clonedTexture.wrapS = THREE.RepeatWrapping;
        clonedTexture.wrapT = THREE.RepeatWrapping;

        return clonedTexture;
    }, [tile.state, textureVariation, untilled1, untilled2, untilled3, tilled1, tilled2, tilled3, watered1, watered2, watered3]);

    // Create material with texture
    const material = useMemo(() => {
        return new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            alphaTest: 0.1,
        });
    }, [texture]);

    return (
        <mesh
            position={[tile.position.x, tile.position.y, tile.position.z]}
            rotation={[-Math.PI / 2, 0, 0]} // Rotate to lay flat on ground
            material={material}
        >
            <planeGeometry args={[FARM_CONFIG.TILE_SIZE * 1.15, FARM_CONFIG.TILE_SIZE * 1.15]} />
        </mesh>
    );
}

// Wrap with Suspense to handle texture loading
function Tile(props) {
    return (
        <Suspense fallback={null}>
            <TileInner {...props} />
        </Suspense>
    );
}

export default Tile;
