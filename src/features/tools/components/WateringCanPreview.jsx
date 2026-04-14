import { useMemo } from 'react';
import * as THREE from 'three';
import { FARM_CONFIG } from '@/features/farm/farm.config';

/**
 * WateringCanPreview Component
 * 
 * Shows a visual preview of tiles that will be watered when using an upgraded watering can.
 * Displays semi-transparent blue overlays on affected tiles.
 * 
 * @param {Object} props
 * @param {Object} props.centerTile - The tile being hovered over
 * @param {Array} props.affectedTileIds - Array of tile IDs that will be watered
 * @param {Array} props.allTiles - All farm tiles
 */
function WateringCanPreview({ centerTile, affectedTileIds, allTiles }) {
    // Get positions of affected tiles
    const affectedPositions = useMemo(() => {
        if (!affectedTileIds || affectedTileIds.length === 0) return [];

        return affectedTileIds
            .map(tileId => {
                const tile = allTiles.find(t => t.id === tileId);
                return tile ? tile.position : null;
            })
            .filter(Boolean);
    }, [affectedTileIds, allTiles]);

    // Create material for preview overlay
    const previewMaterial = useMemo(() => {
        return new THREE.MeshBasicMaterial({
            color: 0x4da6ff, // Light blue
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
    }, []);

    if (!centerTile || affectedPositions.length === 0) return null;

    return (
        <group name="watering-can-preview">
            {affectedPositions.map((position, index) => (
                <mesh
                    key={`preview-${index}`}
                    position={[position.x, position.y + 0.02, position.z]} // Slightly above tile
                    rotation={[-Math.PI / 2, 0, 0]}
                    material={previewMaterial}
                >
                    <planeGeometry args={[FARM_CONFIG.TILE_SIZE * 1.15, FARM_CONFIG.TILE_SIZE * 1.15]} />
                </mesh>
            ))}
        </group>
    );
}

export default WateringCanPreview;
