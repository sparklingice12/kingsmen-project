import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import { getCropSprite, getCropGrowthHours } from '../crops.config';
import { isHarvestable } from '../crops.service';
import { useStore } from '@/state/store';
import { TIME_CONFIG } from '@/features/time/time.config';

function CropSprite({ crop, position, onClick }) {
    const meshRef = useRef();
    const previousStage = useRef(crop?.stage || 1);
    const [progressPercent, setProgressPercent] = useState(0);
    const lastQuantized = useRef(-1);
    const selectedTool = useStore((s) => s.ui.selectedTool);

    const isReady = useMemo(() => {
        if (!crop) return false;
        return isHarvestable(crop);
    }, [crop?.type, crop?.stage]);

    const isWithered = useMemo(() => {
        if (!crop) return false;
        return crop.withered === true && crop.dead !== true;
    }, [crop?.withered, crop?.dead]);

    const isDead = useMemo(() => {
        if (!crop) return false;
        return crop.dead === true;
    }, [crop?.dead]);

    const emojiSprite = useMemo(() => {
        if (!crop) return '🌱';

        // Dead crops show brown/dead version of the crop
        if (isDead) {
            const deadSprites = {
                wheat: '🌾', // Dead brown wheat
                carrot: '🥕', // Dead carrot
                tomato: '🍅', // Rotten tomato
                bean: '🫘', // Dead bean
            };
            return deadSprites[crop.type] || '🥀';
        }

        // Withered crops show withered version
        if (isWithered) {
            const witheredSprites = {
                wheat: '🌾', // Dried wheat (brown)
                carrot: '🥕', // Wilted carrot
                tomato: '🍅', // Rotten tomato
                bean: '🫘', // Dried bean
            };
            return witheredSprites[crop.type] || '🥀';
        }

        return getCropSprite(crop.type, crop.stage);
    }, [crop?.type, crop?.stage, isDead, isWithered]);

    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 128, 128);
        ctx.font = '96px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emojiSprite, 64, 64);
        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.needsUpdate = true;
        return tex;
    }, [emojiSprite]);

    const sparkleTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✨', 32, 32);
        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.needsUpdate = true;
        return tex;
    }, []);

    useFrame(() => {
        if (!crop || isReady || isDead) return;

        const timeOfDay = useStore.getState().game.timeOfDay;
        const growthHours = getCropGrowthHours(crop.type);

        // Use effectiveHoursGrowing which accounts for watering bonus
        const effectiveHoursGrowing = crop.effectiveHoursGrowing || 0;
        const hoursAtCurrentStage = effectiveHoursGrowing % growthHours;

        // Add sub-hour progress for smooth animation
        const subHour = (timeOfDay * TIME_CONFIG.HOURS_PER_DAY) % 1;

        // If withered, show death progress (red bar filling up)
        if (isWithered) {
            const hoursWithoutWater = crop.hoursWithoutWater || 0;
            const deathThreshold = 8; // HOURS_WITHOUT_WATER_BEFORE_DEATH
            const deathProgress = Math.min(1, hoursWithoutWater / deathThreshold);
            const quantized = Math.floor(deathProgress * 100);
            if (quantized !== lastQuantized.current) {
                lastQuantized.current = quantized;
                setProgressPercent(quantized);
            }
        } else {
            // Normal growth progress (green bar)
            const progress = Math.min(1, (hoursAtCurrentStage + (subHour * (crop.watered ? 1.5 : 1.0))) / growthHours);
            const quantized = Math.floor(progress * 100);
            if (quantized !== lastQuantized.current) {
                lastQuantized.current = quantized;
                setProgressPercent(quantized);
            }
        }
    });

    const [springs, api] = useSpring(() => ({
        scale: 1,
        config: { tension: 120, friction: 14 },
    }));

    const [sparkleSpring, sparkleApi] = useSpring(() => ({
        scale: 1,
        opacity: 1,
        config: { tension: 80, friction: 10 },
    }));

    useEffect(() => {
        if (crop && crop.stage > previousStage.current) {
            api.start({
                from: { scale: 0.8 },
                to: [
                    { scale: 1.2 },
                    { scale: 1.0 },
                ],
            });
            previousStage.current = crop.stage;
        }
    }, [crop?.stage, api]);

    useEffect(() => {
        if (isReady) {
            sparkleApi.start({
                from: { scale: 1, opacity: 1 },
                to: async (next) => {
                    while (true) {
                        await next({ scale: 1.2, opacity: 0.7 });
                        await next({ scale: 1, opacity: 1 });
                    }
                },
                loop: true,
            });
        }
    }, [isReady, sparkleApi]);

    if (!crop) return null;

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    // Allow raycasting when info tool or no tool is selected
    const shouldAllowClick = selectedTool === 'none' || selectedTool === 'info';

    return (
        <group position={[position[0], position[1], position[2]]}>
            <a.sprite
                ref={meshRef}
                position={[0, 0.3, 0]}
                scale={springs.scale.to(s => [s, s, 1])}
                onClick={handleClick}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    if (shouldAllowClick) {
                        document.body.style.cursor = 'pointer';
                    }
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'default';
                }}
            >
                <spriteMaterial
                    map={texture}
                    transparent
                    depthTest={false}
                />
            </a.sprite>

            {!isReady && !isDead && (
                <Html
                    position={[0, 0.5, 0.55]}
                    center
                    style={{ pointerEvents: 'none' }}
                    zIndexRange={[10, 0]}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '6px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            border: `1px solid ${isWithered ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                        }}
                    >
                        <div
                            style={{
                                width: `${progressPercent}%`,
                                height: '100%',
                                background: isWithered
                                    ? 'linear-gradient(to right, #ef4444, #dc2626)'
                                    : 'linear-gradient(to right, #4ade80, #22c55e)',
                                borderRadius: '2px',
                                transition: 'width 0.1s linear',
                            }}
                        />
                    </div>
                    {isWithered && (
                        <div style={{
                            fontSize: '24px',
                            marginTop: '4px',
                            textAlign: 'center',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                        }}>
                            💧
                        </div>
                    )}
                </Html>
            )}

            {isDead && (
                <Html
                    position={[0, 0.5, 0.55]}
                    center
                    style={{ pointerEvents: 'none' }}
                    zIndexRange={[10, 0]}
                >
                    <div style={{
                        fontSize: '28px',
                        textAlign: 'center',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    }}>
                        🪓
                    </div>
                </Html>
            )}

            {isReady && (
                <a.sprite
                    position={[0, 0.6, 0]}
                    scale={sparkleSpring.scale.to(s => [s * 0.4, s * 0.4, 1])}
                >
                    <a.spriteMaterial
                        map={sparkleTexture}
                        transparent
                        opacity={sparkleSpring.opacity}
                        depthTest={false}
                    />
                </a.sprite>
            )}
        </group>
    );
}

export default CropSprite;
