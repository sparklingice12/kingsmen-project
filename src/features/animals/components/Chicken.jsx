/**
 * Chicken Component
 * Renders an animated chicken sprite with idle and eating animations
 * Responsive scaling based on viewport size
 */

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ANIMALS_CONFIG } from '../animals.config';

export default function Chicken({ chicken, position, onTap }) {
    const spriteRef = useRef();
    const [frameIndex, setFrameIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [scale, setScale] = useState(1);
    const { viewport, size } = useThree();

    // Load chicken sprite sheet
    const texture = useTexture(ANIMALS_CONFIG.chicken.spriteSheet.path);

    // Configure texture for pixel art
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    useEffect(() => {
        const aspectRatio = size.width / size.height;
        let baseScale = 1.2;

        if (aspectRatio <= 1.0) {
            baseScale = 0.9;
        } else if (aspectRatio <= 1.35) {
            baseScale = 1.1;
        } else if (aspectRatio <= 1.6) {
            baseScale = 1.15;
        } else if (aspectRatio > 2.0) {
            baseScale = 1.4;
        }

        if (size.width < 640) {
            baseScale *= 0.85;
        } else if (size.width < 768) {
            baseScale *= 0.9;
        } else if (size.width < 1024) {
            baseScale *= 0.95;
        }

        setScale(baseScale);
    }, [size.width, size.height]);

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
            scale={[scale, scale, scale]}
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
