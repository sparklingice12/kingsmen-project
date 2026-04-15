import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

const GROUND_SIZE = 40;

function Sprite({ position, texture, size = [1, 1], frameIndex = 0, totalFrames = 1, framesPerRow = 4 }) {
    // Clone texture for independent UV manipulation
    const clonedTexture = useMemo(() => {
        if (!texture) return null;
        const clone = texture.clone();
        clone.needsUpdate = true;

        if (totalFrames > 1) {
            // Calculate UV coordinates for sprite sheet frame
            const col = frameIndex % framesPerRow;
            const row = Math.floor(frameIndex / framesPerRow);
            const rows = Math.ceil(totalFrames / framesPerRow);

            clone.repeat.set(1 / framesPerRow, 1 / rows);
            clone.offset.set(col / framesPerRow, 1 - (row + 1) / rows); // Flip Y for correct orientation
        }

        clone.magFilter = THREE.NearestFilter;
        clone.minFilter = THREE.NearestFilter;

        return clone;
    }, [texture, frameIndex, totalFrames, framesPerRow]);

    if (!clonedTexture) return null;

    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={size} />
            <meshBasicMaterial
                map={clonedTexture}
                transparent
                alphaTest={0.1}
            />
        </mesh>
    );
}

function Tree({ position, frameIndex, texture }) {
    return <Sprite position={position} texture={texture} size={[1.2, 1.2]} frameIndex={frameIndex} totalFrames={4} framesPerRow={4} />;
}

function FlowerPatch({ position, frameIndex, texture }) {
    return <Sprite position={position} texture={texture} size={[0.6, 0.6]} frameIndex={frameIndex} totalFrames={8} framesPerRow={4} />;
}

function Rock({ position, frameIndex, texture }) {
    return <Sprite position={position} texture={texture} size={[0.3, 0.3]} frameIndex={frameIndex} totalFrames={8} framesPerRow={4} />;
}

function Bush({ position, frameIndex, texture }) {
    return <Sprite position={position} texture={texture} size={[0.5, 0.5]} frameIndex={frameIndex} totalFrames={4} framesPerRow={4} />;
}

function Pond({ position, texture }) {
    return <Sprite position={position} texture={texture} size={[2.5, 2.5]} />;
}


function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function FarmBackground() {
    // Load textures from sprite files - useTexture must be called unconditionally
    const [
        grassTexture,
        dirtPathTexture,
        treeTexture,
        flowerTexture,
        rockTexture,
        bushTexture,
        pondTexture
    ] = useTexture([
        '/sprites/background/grass-texture.png',
        '/sprites/background/dirt-path-texture.png',
        '/sprites/background/tree-set.png',
        '/sprites/background/flower-patches.png',
        '/sprites/background/rocks.png',
        '/sprites/background/bushes.png',
        '/sprites/background/pond.png',
    ]);

    // Configure grass texture
    useMemo(() => {
        if (grassTexture) {
            grassTexture.magFilter = THREE.NearestFilter;
            grassTexture.minFilter = THREE.NearestFilter;
            grassTexture.wrapS = THREE.RepeatWrapping;
            grassTexture.wrapT = THREE.RepeatWrapping;
            grassTexture.repeat.set(8, 8);
        }
    }, [grassTexture]);

    // Configure dirt path texture
    useMemo(() => {
        if (dirtPathTexture) {
            dirtPathTexture.magFilter = THREE.NearestFilter;
            dirtPathTexture.minFilter = THREE.NearestFilter;
            dirtPathTexture.wrapS = THREE.RepeatWrapping;
            dirtPathTexture.wrapT = THREE.RepeatWrapping;
            dirtPathTexture.repeat.set(1, 4);
        }
    }, [dirtPathTexture]);

    // Configure sprite textures for pixel-perfect rendering
    useMemo(() => {
        [treeTexture, flowerTexture, rockTexture, bushTexture, pondTexture].forEach(texture => {
            if (texture) {
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.NearestFilter;
            }
        });
    }, [treeTexture, flowerTexture, rockTexture, bushTexture, pondTexture]);

    const trees = useMemo(() => {
        const rng = seededRandom(42);
        const positions = [
            [-8, -0.02, -7], [-6, -0.02, -8], [-9, -0.02, -4],
            [7, -0.02, -7], [9, -0.02, -5], [8, -0.02, -9],
            [-8, -0.02, 6], [-10, -0.02, 3], [-7, -0.02, 9],
            [8, -0.02, 7], [10, -0.02, 4], [7, -0.02, 10],
            [-11, -0.02, 0], [11, -0.02, -1], [-6, -0.02, -11],
            [5, -0.02, -10], [-9, -0.02, 10], [10, -0.02, 9],
            [-12, -0.02, -8], [12, -0.02, 6], [-5, -0.02, 12],
            [6, -0.02, -12], [-10, -0.02, -10], [11, -0.02, 11],
        ];
        return positions.map((pos) => ({
            position: pos,
            frameIndex: Math.floor(rng() * 4), // 4 tree variations
        }));
    }, []);

    const flowerPatches = useMemo(() => {
        const rng = seededRandom(99);
        const positions = [
            [-6, -0.03, -3], [6.5, -0.03, -2], [-5.5, -0.03, 5], [7, -0.03, 4],
            [-7.5, -0.03, -6], [5.5, -0.03, 8], [-3, -0.03, -7], [3, -0.03, 7.5],
        ];
        return positions.map((pos, i) => ({
            position: pos,
            frameIndex: i % 8, // Use all 8 flower variations
        }));
    }, []);

    const rocks = useMemo(() => {
        const rng = seededRandom(77);
        const positions = [
            [-5.5, -0.04, -1], [6.5, -0.04, 1], [-6, -0.04, 7],
            [5, -0.04, -6], [-8, -0.04, -2], [9, -0.04, 2],
            [-4, -0.04, 9], [8, -0.04, -3],
        ];
        return positions.map((pos, i) => ({
            position: pos,
            frameIndex: i % 8, // Use all 8 rock variations
        }));
    }, []);

    const bushes = useMemo(() => {
        const rng = seededRandom(55);
        const positions = [
            [-5.5, -0.03, 1], [5.5, -0.03, -4], [-7, -0.03, 4],
            [6, -0.03, 6], [-9, -0.03, -6], [9, -0.03, -8],
            [-4.5, -0.03, -5], [4.5, -0.03, 5],
        ];
        return positions.map((pos) => ({
            position: pos,
            frameIndex: Math.floor(rng() * 4), // 4 bush variations
        }));
    }, []);

    return (
        <group name="farm-background">
            <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
                <meshBasicMaterial map={grassTexture} />
            </mesh>

            <mesh position={[0, -0.04, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.2, 6]} />
                <meshBasicMaterial map={dirtPathTexture} />
            </mesh>
            <mesh position={[0, -0.035, 8.7]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.5, 8]} />
                <meshBasicMaterial map={dirtPathTexture} />
            </mesh>

            {trees.map((t, i) => (
                <Tree key={`tree-${i}`} position={t.position} frameIndex={t.frameIndex} texture={treeTexture} />
            ))}

            {flowerPatches.map((patch, i) => (
                <FlowerPatch key={`flowers-${i}`} position={patch.position} frameIndex={patch.frameIndex} texture={flowerTexture} />
            ))}

            {rocks.map((r, i) => (
                <Rock key={`rock-${i}`} position={r.position} frameIndex={r.frameIndex} texture={rockTexture} />
            ))}

            {bushes.map((b, i) => (
                <Bush key={`bush-${i}`} position={b.position} frameIndex={b.frameIndex} texture={bushTexture} />
            ))}

            <Pond position={[-5.5, -0.02, 0]} texture={pondTexture} />
        </group>
    );
}

export default FarmBackground;
