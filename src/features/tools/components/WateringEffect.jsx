import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * WateringEffect Component
 * 
 * Shows water droplet particles when watering a tile:
 * - Multiple water droplets falling
 * - Splash effect on impact
 * - Fade out animation
 */
function WateringEffect({ position, onComplete }) {
    const groupRef = useRef();
    const particles = useRef([]);
    const startTime = useRef(Date.now());
    const duration = 800; // 0.8 seconds

    // Create water droplet texture
    const dropletTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Draw water droplet
        ctx.clearRect(0, 0, 32, 32);
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 12);
        gradient.addColorStop(0, 'rgba(100, 200, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(50, 150, 255, 0.6)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 12, 0, Math.PI * 2);
        ctx.fill();

        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.needsUpdate = true;
        return tex;
    }, []);

    // Animate water droplets
    useFrame(() => {
        const elapsed = Date.now() - startTime.current;
        const progress = Math.min(1, elapsed / duration);

        if (progress >= 1) {
            onComplete?.();
            return;
        }

        // Update droplet positions
        particles.current.forEach((particle, i) => {
            if (particle) {
                const delay = i * 0.1; // Stagger droplets
                const particleProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

                // Fall down
                particle.position.y = 1.5 - (particleProgress * 1.5);

                // Slight horizontal spread
                const angle = (i / 8) * Math.PI * 2;
                particle.position.x = Math.cos(angle) * 0.2 * particleProgress;
                particle.position.z = Math.sin(angle) * 0.2 * particleProgress;

                // Fade out near the end
                if (particle.material) {
                    particle.material.opacity = 1 - (particleProgress * 0.5);
                }

                // Scale down as it falls
                const scale = 0.2 * (1 - particleProgress * 0.5);
                particle.scale.set(scale, scale, 1);
            }
        });
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Water droplet sprites */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <sprite
                    key={i}
                    ref={(el) => (particles.current[i] = el)}
                    scale={[0.2, 0.2, 1]}
                >
                    <spriteMaterial
                        map={dropletTexture}
                        transparent
                        opacity={1}
                        depthTest={false}
                    />
                </sprite>
            ))}
        </group>
    );
}

export default WateringEffect;
