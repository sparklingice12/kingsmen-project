import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * HarvestEffect Component
 * 
 * Shows a visual effect when a crop is harvested:
 * - Floating emoji particles
 * - Coin reward text
 * - Fade out animation
 */
function HarvestEffect({ position, cropType, coinValue, onComplete }) {
    const groupRef = useRef();
    const particles = useRef([]);
    const startTime = useRef(Date.now());
    const duration = 1500; // 1.5 seconds

    // Create emoji texture for the crop
    const emojiTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Get crop emoji
        const emojis = {
            wheat: '🌾',
            carrot: '🥕',
            tomato: '🍅',
            bean: '🫘',
        };
        ctx.fillText(emojis[cropType] || '🌱', 32, 32);

        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.needsUpdate = true;
        return tex;
    }, [cropType]);

    // Animate particles
    useFrame(() => {
        const elapsed = Date.now() - startTime.current;
        const progress = Math.min(1, elapsed / duration);

        if (progress >= 1) {
            onComplete?.();
            return;
        }

        // Update particle positions
        particles.current.forEach((particle, i) => {
            if (particle) {
                const angle = (i / 5) * Math.PI * 2;
                const radius = progress * 0.5;
                particle.position.x = Math.cos(angle) * radius;
                particle.position.z = Math.sin(angle) * radius;
                particle.position.y = progress * 1.5;

                // Fade out
                if (particle.material) {
                    particle.material.opacity = 1 - progress;
                }
            }
        });
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Particle sprites */}
            {[0, 1, 2, 3, 4].map((i) => (
                <sprite
                    key={i}
                    ref={(el) => (particles.current[i] = el)}
                    scale={[0.3, 0.3, 1]}
                >
                    <spriteMaterial
                        map={emojiTexture}
                        transparent
                        opacity={1}
                        depthTest={false}
                    />
                </sprite>
            ))}

            {/* Coin reward text - only show if coins are earned */}
            {coinValue > 0 && (
                <Html
                    position={[0, 0.5, 0]}
                    center
                    style={{ pointerEvents: 'none' }}
                    zIndexRange={[100, 0]}
                >
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#FFD700',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            animation: 'floatUp 1.5s ease-out forwards',
                        }}
                    >
                        +{coinValue} 🪙
                    </div>
                </Html>
            )}
        </group>
    );
}

export default HarvestEffect;
