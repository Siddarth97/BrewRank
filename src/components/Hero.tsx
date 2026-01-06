import React from 'react';
import { Coffee } from 'lucide-react';

interface HeroProps {
    setQuery: (query: string) => void;
    handleSearch: () => void;
}

const Hero: React.FC<HeroProps> = ({ setQuery, handleSearch }) => {
    return (
        <div className="text-center py-24 space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="relative inline-block">
                <div className="absolute -inset-4 bg-amber-100/50 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-amber-50">
                    <Coffee className="text-[#3E2723] w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-5xl font-extrabold text-[#2D1B18] leading-tight">
                        The Better Way to <br /> <span className="text-amber-700 italic">Caffeinate.</span>
                    </h2>
                </div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                We analyze thousands of Google reviews instantly to rank coffee shops by what actually matters: <span className="text-amber-900 underline decoration-amber-200">Taste</span>, <span className="text-amber-900 underline decoration-amber-200">Variety</span>, and <span className="text-amber-900 underline decoration-amber-200">Vibe</span>.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
                {['Bengaluru', 'London', 'Tokyo', 'San Francisco'].map(loc => (
                    <button
                        key={loc}
                        onClick={() => { setQuery(loc); handleSearch(); }}
                        className="px-6 py-2.5 bg-white border border-amber-100 rounded-full text-sm font-semibold text-amber-900 hover:bg-amber-50 hover:shadow-md transition-all active:scale-95"
                    >
                        {loc}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Hero;
