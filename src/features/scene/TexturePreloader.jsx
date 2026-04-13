import { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * TexturePreloader Component
 * 
 * Preloads all game textures before rendering the scene.
 * This prevents the black screen issue where textures load one by one.
 */
function TexturePreloader({ onLoaded, children }) {
    const [isLoaded, setIsLoaded] = useState(false);

    // Preload all tile textures
    const textures = useLoader(THREE.TextureLoader, [
        // Untilled variations
        '/sprites/land/untilled/untilled-1.png',
        '/sprites/land/untilled/untilled-2.png',
        '/sprites/land/untilled/untilled-3.png',
        // Tilled variations
        '/sprites/land/tilled/tilled-1.png',
        '/sprites/land/tilled/tilled-2.png',
        '/sprites/land/tilled/tilled-3.png',
        // Watered variations
        '/sprites/land/watered/watered-1.png',
        '/sprites/land/watered/watered-2.png',
        '/sprites/land/watered/watered-3.png',
        // Background textures
        '/sprites/background/grass-texture.png',
        '/sprites/background/dirt-path-texture.png',
        '/sprites/background/tree-set.png',
        '/sprites/background/flower-patches.png',
        '/sprites/background/rocks.png',
        '/sprites/background/bushes.png',
        '/sprites/background/pond.png',
        '/sprites/background/farm-shed.png',
        // Fence textures
        '/sprites/farm/fence-horizontal.png',
        '/sprites/farm/fence-vertical.png',
        '/sprites/farm/fence-corners.png',
        '/sprites/farm/fence-post.png',
        '/sprites/farm/fence-gate.png',
        // Player
        '/sprites/farmer.png',
        // Tools
        '/sprites/hoe.png',
        '/sprites/watering-can.png',
        '/sprites/seed-bag.png',
        '/sprites/harvesting-tool.png',
        '/sprites/hand.png',
        '/sprites/info.png',
        // NPC
        '/sprites/scarecrow.png',
        // Animals
        '/sprites/animals/chicken-spritesheet.png',
    ]);

    useEffect(() => {
        if (textures && textures.length > 0 && !isLoaded) {
            // Configure all textures for pixel-perfect rendering
            textures.forEach(texture => {
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.NearestFilter;
                texture.needsUpdate = true;
            });

            setIsLoaded(true);
            if (onLoaded) onLoaded();
        }
    }, [textures, isLoaded]); // Removed onLoaded from dependencies

    // Don't render children until textures are loaded
    return isLoaded ? children : null;
}

export default TexturePreloader;
