import React from 'react';
import { Star, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';
import { CoffeeShop } from '../types';

interface CoffeeShopCardProps {
    shop: CoffeeShop;
    isSelected: boolean;
    toggleSelection: (shop: CoffeeShop) => void;
    isTopTaste: boolean;
}

const CoffeeShopCard: React.FC<CoffeeShopCardProps> = ({ shop, isSelected, toggleSelection, isTopTaste }) => {
    return (
        <div
            onClick={() => toggleSelection(shop)}
            className={`group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden cursor-pointer border-2 transition-all duration-300 ${isSelected
                    ? 'border-amber-600 shadow-2xl ring-4 ring-amber-600/10 -translate-y-2'
                    : 'border-transparent hover:border-amber-200 hover:shadow-xl'
                }`}
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={shop.imageUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isTopTaste && (
                        <div className="bg-amber-400 text-[#2D1B18] px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                            <Star size={10} fill="currentColor" /> Critic's Choice
                        </div>
                    )}
                    {shop.rating >= 4.7 && (
                        <div className="bg-white text-gray-900 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                            <CheckCircle2 size={10} className="text-green-600" /> High Rating
                        </div>
                    )}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-1 line-clamp-1">{shop.name}</h3>
                    <p className="text-white/70 text-sm flex items-center gap-1.5 font-medium">
                        <MapPin size={14} className="text-amber-400" /> {shop.address}
                    </p>
                </div>

                <div className={`absolute top-4 right-4 p-2 rounded-2xl transition-all ${isSelected ? 'bg-amber-600 text-white scale-110 shadow-lg' : 'bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100'
                    }`}>
                    <CheckCircle2 size={24} />
                </div>
            </div>

            <div className="p-8 space-y-6">
                <p className="text-gray-600 italic leading-relaxed text-sm line-clamp-3">
                    "{shop.summary}"
                </p>

                <div className="flex gap-4">
                    {[
                        { label: 'Taste', val: shop.tasteScore, color: 'bg-amber-500' },
                        { label: 'Variety', val: shop.varietyScore, color: 'bg-stone-500' },
                        { label: 'Vibe', val: shop.ambienceScore, color: 'bg-emerald-500' }
                    ].map(metric => (
                        <div key={metric.label} className="flex-1">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{metric.label}</span>
                                <span className="text-sm font-black text-gray-900">{metric.val}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${metric.color} rounded-full transition-all duration-1000`}
                                    style={{ width: `${metric.val * 10}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <a
                        href={shop.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-2"
                    >
                        View Map <ExternalLink size={14} />
                    </a>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Star className="text-amber-500 fill-amber-500" size={16} />
                        <span className="text-sm font-black text-gray-900">{shop.rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoffeeShopCard;
