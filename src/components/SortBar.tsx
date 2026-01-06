import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortKey = 'tasteScore' | 'varietyScore' | 'ambienceScore' | 'rating';

interface SortBarProps {
    shopsCount: number;
    sortBy: SortKey;
    setSortBy: (key: SortKey) => void;
}

const SortBar: React.FC<SortBarProps> = ({ shopsCount, sortBy, setSortBy }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl font-black text-gray-900">Curated Picks</h2>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{shopsCount} FOUND</span>
                </div>
                <p className="text-gray-500 font-medium">Click a shop to add it to your comparison dashboard.</p>
            </div>

            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                <span className="pl-4 text-xs font-bold text-gray-400 flex items-center gap-2 shrink-0"><ArrowUpDown size={14} /> SORT BY</span>
                {(['rating', 'tasteScore', 'ambienceScore', 'varietyScore'] as SortKey[]).map((key) => (
                    <button
                        key={key}
                        onClick={() => setSortBy(key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${sortBy === key
                                ? 'bg-[#3E2723] text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        {key.replace('Score', '').toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SortBar;
