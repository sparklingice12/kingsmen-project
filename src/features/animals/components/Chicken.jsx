/**
 * Chicken Component
 * Renders an animated chicken sprite with idle and eating animations
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ANIMALS_CONFIG } from '../animals.config';

export default function Chicken({ chicken, position, onTap }) {
    const spriteRef = useRef();
    const [frameIndex, setFrameIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Load chicken sprite sheet
    const texture = useTexture(ANIMALS_CONFIG.chicken.spriteSheet.path);

    // Configure texture for pixel art
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    // Determine current animation based on fed status
    const currentAnimation = chicken.fed ? 'eating' : 'idle';
    const animConfig = ANIMALS_CONFIG.chicken.animations[currentAnimation];

    // Calculate UV offset for current frame
    const uvOffset = useMemo(() => {
        const { frameWidth, frameHeight, columns } = ANIMALS_CONFIG.chicken.spriteSheet;
        const sheetWidth = frameWidth * columns;
        const sheetHeight = frameHeight * ANIMALS_CONFIG.chicken.spriteSheet.rows;

        const frame = animConfig.frames[frameIndex];
        const col = frame % columns;
        const row = Math.floor(frame / columns);

        return {
            x: (col * frameWidth) / sheetWidth,
            y: 1 - ((row + 1) * frameHeight) / sheetHeight,
            width: frameWidth / sheetWidth,
            height: frameHeight / sheetHeight,
        };
    }, [frameIndex, animConfig.frames]);

    // Animate sprite frames
    useFrame((state, delta) => {
        setElapsedTime((prev) => {
            const newTime = prev + delta;
            const frameTime = 1 / animConfig.fps;

            if (newTime >= frameTime) {
                setFrameIndex((prevIndex) => (prevIndex + 1) % animConfig.frames.length);
                return 0;
            }

            return newTime;
        });

        // Add subtle bobbing animation
        if (spriteRef.current) {
            spriteRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    // Handle tap/click
    const handleClick = (e) => {
        e.stopPropagation();
        if (onTap) {
            onTap(chicken);
        }
    };

    return (
        <sprite
            ref={spriteRef}
            position={position}
            scale={[1, 1, 1]}
            onClick={handleClick}
        >
            <spriteMaterial
                map={texture}
                transparent
                map-offset={[uvOffset.x, uvOffset.y]}
                map-repeat={[uvOffset.width, uvOffset.height]}
            />
        </sprite>
    );
}
