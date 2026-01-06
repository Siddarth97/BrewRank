import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CoffeeShop } from '../types';

interface FloatingActionBarProps {
    selectedShops: CoffeeShop[];
}

const FloatingActionBar: React.FC<FloatingActionBarProps> = ({ selectedShops }) => {
    if (selectedShops.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 animate-in slide-in-from-bottom-10">
            <div className="bg-[#2D1B18] text-[#FDF8F5] p-3 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10 ring-8 ring-black/5">
                <div className="flex items-center gap-3 pl-4">
                    <div className="flex -space-x-3">
                        {selectedShops.map(shop => (
                            <div key={shop.id} className="w-10 h-10 rounded-full border-2 border-[#2D1B18] bg-amber-100 overflow-hidden flex items-center justify-center text-[#2D1B18] text-[10px] font-black">
                                {shop.name.charAt(0)}
                            </div>
                        ))}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-black uppercase tracking-widest text-amber-400">Comparing</p>
                        <p className="text-xs font-medium text-white/70">{selectedShops.length} of 4 shops selected</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        const element = document.querySelector('section:last-of-type');
                        element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-amber-400 text-[#2D1B18] px-8 py-3 rounded-2xl font-black text-sm hover:bg-amber-300 transition-all active:scale-95 shadow-lg flex items-center gap-2"
                >
                    Explore Comparison <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default FloatingActionBar;
