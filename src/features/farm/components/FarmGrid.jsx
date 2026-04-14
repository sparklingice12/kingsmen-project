import { useState, useEffect } from 'react';
import { useStore } from '@/state/store';
import Tile from './Tile';
import { CropSprite, HarvestEffect } from '@/features/crops';
import WateringEffect from '@/features/tools/components/WateringEffect';
import WateringCanPreview from '@/features/tools/components/WateringCanPreview';
import { FARM_CONFIG } from '../farm.config';

/**
 * FarmGrid Component
 * 
 * Renders all 64 farm tiles in the 3D scene.
 * Subscribes to Zustand store for tile state updates.
 * Renders crops on top of tiles.
 * 
 * @param {Object} props
 * @param {Object} props.hoveredTile - Currently hovered tile (for watering can preview)
 * @param {Array} props.affectedTileIds - Tile IDs that will be affected by watering can
 */
function FarmGrid({ hoveredTile, affectedTileIds }) {
    const tiles = useStore((s) => s.farm.tiles);
    const selectedTool = useStore((s) => s.ui.selectedTool);
    const openGameModal = useStore((s) => s.ui.openGameModal);
    const [harvestEffects, setHarvestEffects] = useState([]);
    const [wateringEffects, setWateringEffects] = useState([]);

    // Listen for harvest events
    useEffect(() => {
        const handleHarvest = (event) => {
            const { position, cropType, coinValue } = event.detail;
            const effectId = Date.now();

            setHarvestEffects(prev => [...prev, {
                id: effectId,
                position: [position.x, position.y, position.z],
                cropType,
                coinValue,
            }]);
        };

        window.addEventListener('harvestCrop', handleHarvest);
        return () => window.removeEventListener('harvestCrop', handleHarvest);
    }, []);

    // Listen for watering events
    useEffect(() => {
        const handleWatering = (event) => {
            const { position } = event.detail;
            const effectId = Date.now();

            setWateringEffects(prev => [...prev, {
                id: effectId,
                position: [position.x, position.y, position.z],
            }]);
        };

        window.addEventListener('waterTile', handleWatering);
        return () => window.removeEventListener('waterTile', handleWatering);
    }, []);

    // Remove effect when animation completes
    const removeEffect = (id) => {
        setHarvestEffects(prev => prev.filter(e => e.id !== id));
    };

    const removeWateringEffect = (id) => {
        setWateringEffects(prev => prev.filter(e => e.id !== id));
    };

    // Handle crop click to open educational modal (only when no tool is selected OR info tool is selected)
    const handleCropClick = (cropType, tileId) => {
        // Open modal if no tool selected OR if info tool is selected
        if (selectedTool !== 'none' && selectedTool !== 'info') {
            return;
        }

        openGameModal('educational', { cropId: cropType, tileId });
    };

    return (
        <group name="farm-grid">
            {/* Brown background plane to hide gaps between tiles */}
            <mesh
                position={[0, -0.01, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[
                    FARM_CONFIG.GRID_SIZE * FARM_CONFIG.TILE_SIZE,
                    FARM_CONFIG.GRID_SIZE * FARM_CONFIG.TILE_SIZE
                ]} />
                <meshBasicMaterial color="#6b5a3d" side={2} />
            </mesh>

            {/* Render tiles */}
            {tiles.map((tile) => (
                <Tile key={tile.id} tile={tile} />
            ))}

            {/* Render crops */}
            {tiles.map((tile) => {
                if (!tile.crop) return null;

                const cropData = typeof tile.crop === 'string'
                    ? { type: tile.crop, stage: tile.growthStage || 1, growthProgress: 0 }
                    : tile.crop;

                const cropType = cropData.type;

                return (
                    <CropSprite
                        key={`crop-${tile.id}`}
                        crop={cropData}
                        position={[tile.position.x, tile.position.y, tile.position.z]}
                        onClick={(e) => {
                            // Only stop propagation if no tool is selected OR info tool is selected
                            // This allows tool clicks to pass through to the tile
                            if (selectedTool === 'none' || selectedTool === 'info') {
                                e.stopPropagation();
                                handleCropClick(cropType, tile.id);
                            }
                            // If a tool is selected, let the click pass through to the tile
                        }}
                    />
                );
            })}

            {/* Render harvest effects */}
            {harvestEffects.map((effect) => (
                <HarvestEffect
                    key={effect.id}
                    position={effect.position}
                    cropType={effect.cropType}
                    coinValue={effect.coinValue}
                    onComplete={() => removeEffect(effect.id)}
                />
            ))}

            {/* Render watering effects */}
            {wateringEffects.map((effect) => (
                <WateringEffect
                    key={effect.id}
                    position={effect.position}
                    onComplete={() => removeWateringEffect(effect.id)}
                />
            ))}

            {/* Render watering can preview overlay */}
            {selectedTool === 'watering_can' && hoveredTile && affectedTileIds && (
                <WateringCanPreview
                    centerTile={hoveredTile}
                    affectedTileIds={affectedTileIds}
                    allTiles={tiles}
                />
            )}
        </group>
    );
}

export default FarmGrid;
