import React from 'react';
import { Trophy, Sparkles, Utensils } from 'lucide-react';
import { CoffeeShop } from '../types';

interface HighlightsProps {
    highlights: {
        bestTaste: CoffeeShop;
        bestVibe: CoffeeShop;
        bestVariety: CoffeeShop;
    } | null;
}

const Highlights: React.FC<HighlightsProps> = ({ highlights }) => {
    if (!highlights) return null;

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 flex items-center gap-5 hover:bg-amber-50 transition-colors group">
                <div className="bg-amber-100 p-4 rounded-2xl text-amber-800 group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Best For Taste</p>
                    <h4 className="font-bold text-gray-900 text-lg truncate">{highlights.bestTaste.name}</h4>
                </div>
            </div>
            <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100 flex items-center gap-5 hover:bg-purple-50 transition-colors group">
                <div className="bg-purple-100 p-4 rounded-2xl text-purple-800 group-hover:scale-110 transition-transform"><Sparkles size={24} /></div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-widest">Best Vibe</p>
                    <h4 className="font-bold text-gray-900 text-lg truncate">{highlights.bestVibe.name}</h4>
                </div>
            </div>
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-5 hover:bg-emerald-50 transition-colors group">
                <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-800 group-hover:scale-110 transition-transform"><Utensils size={24} /></div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Most Variety</p>
                    <h4 className="font-bold text-gray-900 text-lg truncate">{highlights.bestVariety.name}</h4>
                </div>
            </div>
        </section>
    );
};

export default Highlights;
