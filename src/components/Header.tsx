import React from 'react';
import { Search, Coffee } from 'lucide-react';

interface HeaderProps {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: (e?: React.FormEvent) => void;
    loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ query, setQuery, handleSearch, loading }) => {
    return (
        <header className="bg-[#2D1B18] text-[#FDF8F5] py-5 px-6 shadow-xl sticky top-0 z-50 border-b border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
                    <div className="bg-amber-100 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                        <Coffee className="text-[#3E2723]" size={28} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">BrewRank</h1>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-[450px]">
                    <input
                        type="text"
                        placeholder="Enter a city (e.g. 'Bengaluru', 'NYC')..."
                        className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:bg-white/15 transition-all text-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-400 text-[#2D1B18] px-5 py-2 rounded-xl text-xs font-bold hover:bg-amber-300 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                    >
                        {loading ? 'Searching...' : 'Find Coffee'}
                    </button>
                </form>
            </div>
        </header>
    );
};

export default Header;
