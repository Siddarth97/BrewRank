import React from 'react';
import { CoffeeShop } from '../types';
import CoffeeShopCard from './CoffeeShopCard';

interface ShopGridProps {
    sortedShops: CoffeeShop[];
    selectedShops: CoffeeShop[];
    toggleSelection: (shop: CoffeeShop) => void;
    highlights: { bestTaste: CoffeeShop } | null;
}

const ShopGrid: React.FC<ShopGridProps> = ({ sortedShops, selectedShops, toggleSelection, highlights }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedShops.map((shop) => {
                const isSelected = selectedShops.some(s => s.id === shop.id);
                const isTopTaste = shop.id === highlights?.bestTaste.id;

                return (
                    <CoffeeShopCard
                        key={shop.id}
                        shop={shop}
                        isSelected={isSelected}
                        toggleSelection={toggleSelection}
                        isTopTaste={isTopTaste}
                    />
                );
            })}
        </div>
    );
};

export default ShopGrid;
