/**
 * Animals Module
 * Manages chickens on the farm - rendering, feeding, and egg production
 */

import { useEffect } from 'react';
import { useStore } from '@/state/store';
import Chicken from './components/Chicken';
import { animalsService } from './animals.service';
import { CHICKEN_POSITIONS, MAX_CHICKENS } from './animals.config';

export default function AnimalsModule() {
    const chickens = useStore((s) => s.animals.chickens);
    const initializeChickens = useStore((s) => s.animals.initializeChickens);
    const openGameModal = useStore((s) => s.ui.openGameModal);
    const currentDay = useStore((s) => s.game.currentDay);

    // Initialize chickens on mount
    useEffect(() => {
        if (chickens.length === 0) {
            const initialChickens = CHICKEN_POSITIONS.slice(0, MAX_CHICKENS).map((pos, index) =>
                animalsService.createChicken(index, pos)
            );
            initializeChickens(initialChickens);
        }
    }, [chickens.length, initializeChickens]);

    // Handle chicken tap - show educational modal
    const handleChickenTap = (chicken) => {
        openGameModal('educational', {
            type: 'chicken',
            chickenId: chicken.id,
        });
    };

    return (
        <group name="animals">
            {chickens.map((chicken) => (
                <Chicken
                    key={chicken.id}
                    chicken={chicken}
                    position={[chicken.position.x, 0.5, chicken.position.y]}
                    onTap={handleChickenTap}
                />
            ))}
        </group>
    );
}
