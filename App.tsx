
import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Coffee, Star, BarChart3, Loader2, 
  ChevronRight, X, Info, Trophy, Utensils, Sparkles,
  ArrowUpDown, ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react';
import { analyzeCoffeeShops } from './geminiService';
import { CoffeeShop, ComparisonData } from './types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';

type SortKey = 'tasteScore' | 'varietyScore' | 'ambienceScore' | 'rating';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState<CoffeeShop[]>([]);
  const [selectedShops, setSelectedShops] = useState<CoffeeShop[]>([]);
  const [groundingUrls, setGroundingUrls] = useState<{ uri: string; title: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      let location: { lat: number; lng: number } | string = query;
      
      // If query is empty, try browser geolocation
      if (!query) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { 
              timeout: 10000,
              enableHighAccuracy: false
            });
          });
          location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch (err) {
          // If geolocation fails, we'll just search "near me" as a string
          location = "top coffee shops nearby";
        }
      }

      const result = await analyzeCoffeeShops(location, query || "Best specialty coffee nearby");
      
      if (result.shops.length === 0) {
        setError("No shops were found for that location. Try a more specific city name or checking your internet connection.");
      } else {
        setShops(result.shops);
        setGroundingUrls(result.groundingUrls);
      }
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("API_KEY")) {
        setError("Invalid API Key. Please ensure your environment is configured correctly.");
      } else {
        setError("We couldn't reach the coffee experts. The AI might be busy or the location is too specific.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedShops = useMemo(() => {
    return [...shops].sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
  }, [shops, sortBy]);

  const highlights = useMemo(() => {
    if (shops.length === 0) return null;
    return {
      bestTaste: [...shops].sort((a, b) => b.tasteScore - a.tasteScore)[0],
      bestVibe: [...shops].sort((a, b) => b.ambienceScore - a.ambienceScore)[0],
      bestVariety: [...shops].sort((a, b) => b.varietyScore - a.varietyScore)[0],
    };
  }, [shops]);

  const toggleSelection = (shop: CoffeeShop) => {
    setSelectedShops(prev => {
      const isSelected = prev.find(s => s.id === shop.id);
      if (isSelected) return prev.filter(s => s.id !== shop.id);
      if (prev.length >= 4) return prev;
      return [...prev, shop];
    });
  };

  const getComparisonData = (): ComparisonData[] => {
    return [
      {
        category: 'Taste',
        ...selectedShops.reduce((acc, shop) => ({ ...acc, [shop.name]: shop.tasteScore }), {})
      },
      {
        category: 'Variety',
        ...selectedShops.reduce((acc, shop) => ({ ...acc, [shop.name]: shop.varietyScore }), {})
      },
      {
        category: 'Ambience',
        ...selectedShops.reduce((acc, shop) => ({ ...acc, [shop.name]: shop.ambienceScore }), {})
      }
    ];
  };

  const colors = ['#5D4037', '#8D6E63', '#A1887F', '#D7CCC8'];

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-200">
      {/* Dynamic Header */}
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10 space-y-12">
        {/* Hero / Welcome */}
        {!hasSearched && !loading && !error && (
          <div className="text-center py-24 space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-amber-100/50 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-amber-50">
                <Coffee className="text-[#3E2723] w-16 h-16 mx-auto mb-4" />
                <h2 className="text-5xl font-extrabold text-[#2D1B18] leading-tight">
                  The Better Way to <br/> <span className="text-amber-700 italic">Caffeinate.</span>
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
        )}

        {/* Loading / Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
            <div className="relative">
               <Loader2 className="animate-spin text-amber-700 w-16 h-16" />
               <Coffee className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-900 w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-900">Brewing Insights</p>
              <p className="text-amber-700/60 font-medium">Filtering the best roasts in {query || 'your area'}...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-3xl flex flex-col items-center text-center gap-4 animate-in slide-in-from-top-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600"><AlertCircle size={32} /></div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">Search Notice</h3>
              <p className="text-amber-800 mt-1 max-w-md">{error}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setHasSearched(false); setError(null); }} className="mt-2 text-sm font-bold bg-[#3E2723] text-white px-6 py-2 rounded-xl shadow-sm">Try Another City</button>
            </div>
          </div>
        )}

        {/* Results Content */}
        {shops.length > 0 && !loading && (
          <div className="space-y-12 animate-in fade-in duration-500">
            
            {/* 1. Quick Highlights Bar */}
            {highlights && (
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
            )}

            {/* 2. Sorting & Stats Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-black text-gray-900">Curated Picks</h2>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{shops.length} FOUND</span>
                </div>
                <p className="text-gray-500 font-medium">Click a shop to add it to your comparison dashboard.</p>
              </div>

              <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                <span className="pl-4 text-xs font-bold text-gray-400 flex items-center gap-2 shrink-0"><ArrowUpDown size={14} /> SORT BY</span>
                {(['rating', 'tasteScore', 'ambienceScore', 'varietyScore'] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      sortBy === key 
                        ? 'bg-[#3E2723] text-white shadow-md' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {key.replace('Score', '').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedShops.map((shop) => {
                const isSelected = selectedShops.some(s => s.id === shop.id);
                const isTopTaste = shop.id === highlights?.bestTaste.id;
                
                return (
                  <div 
                    key={shop.id}
                    onClick={() => toggleSelection(shop)}
                    className={`group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                      isSelected 
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

                      <div className={`absolute top-4 right-4 p-2 rounded-2xl transition-all ${
                        isSelected ? 'bg-amber-600 text-white scale-110 shadow-lg' : 'bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100'
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
              })}
            </div>

            {/* 4. Comparison Dashboard (The "End Results") */}
            {selectedShops.length > 0 && (
              <section className="bg-[#FAF7F2] p-8 md:p-12 rounded-[3rem] shadow-2xl border-2 border-amber-100/50 space-y-12 animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-4xl font-black text-[#2D1B18]">Deep Comparison</h2>
                    <p className="text-amber-800/60 font-medium text-lg mt-1">Analyzing {selectedShops.length} of your favorites side-by-side.</p>
                  </div>
                  <button 
                    onClick={() => setSelectedShops([])}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-500 font-bold text-sm shadow-sm hover:text-red-600 transition-all border border-gray-100"
                  >
                    <X size={16} /> Clear Comparison
                  </button>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto rounded-3xl border border-amber-100 bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-amber-50/50">
                        <th className="p-6 text-xs font-black text-amber-900 uppercase">Feature</th>
                        {selectedShops.map(shop => (
                          <th key={shop.id} className="p-6 text-sm font-black text-gray-900 min-w-[200px] border-l border-amber-100">
                            {shop.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50">
                      <tr>
                        <td className="p-6 text-xs font-black text-gray-400 uppercase">Expert Summary</td>
                        {selectedShops.map(shop => (
                          <td key={shop.id} className="p-6 text-sm text-gray-600 leading-relaxed border-l border-amber-100 italic">
                            "{shop.summary}"
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-6 text-xs font-black text-gray-400 uppercase">Location</td>
                        {selectedShops.map(shop => (
                          <td key={shop.id} className="p-6 text-sm font-medium text-gray-900 border-l border-amber-100">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-amber-600 shrink-0" />
                              {shop.address}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-6 text-xs font-black text-gray-400 uppercase">Overall Rating</td>
                        {selectedShops.map(shop => (
                          <td key={shop.id} className="p-6 border-l border-amber-100">
                            <div className="flex items-center gap-2 text-xl font-black">
                              <Star className="text-amber-500 fill-amber-500" size={20} />
                              {shop.rating}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 pt-8">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-100">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                      <BarChart3 className="text-amber-700" /> Metric Distribution
                    </h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getComparisonData()}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                          <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                          <Tooltip 
                            cursor={{fill: '#F8FAFC'}}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend wrapperStyle={{paddingTop: '20px'}} />
                          {selectedShops.map((shop, i) => (
                            <Bar 
                              key={shop.id} 
                              dataKey={shop.name} 
                              fill={colors[i % colors.length]} 
                              radius={[6, 6, 0, 0]} 
                              barSize={32}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-100">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                      <Sparkles className="text-purple-700" /> Flavor & Vibe DNA
                    </h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getComparisonData()}>
                          <PolarGrid stroke="#E2E8F0" />
                          <PolarAngleAxis dataKey="category" tick={{fill: '#64748B', fontSize: 12, fontWeight: 700}} />
                          <PolarRadiusAxis angle={30} domain={[0, 10]} axisLine={false} tick={false} />
                          {selectedShops.map((shop, i) => (
                            <Radar
                              key={shop.id}
                              name={shop.name}
                              dataKey={shop.name}
                              stroke={colors[i % colors.length]}
                              fill={colors[i % colors.length]}
                              fillOpacity={0.2}
                              strokeWidth={3}
                            />
                          ))}
                          <Legend wrapperStyle={{paddingTop: '20px'}} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      {selectedShops.length > 0 && (
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
      )}

      {/* Sources Footer Section */}
      {shops.length > 0 && groundingUrls.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-8 pb-12">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 font-black text-xs uppercase tracking-widest">
              <Info size={16} /> Data Verification
            </div>
            <div className="flex flex-wrap gap-3">
              {groundingUrls.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-gray-500 hover:text-amber-900 flex items-center gap-1.5 transition-colors"
                >
                  {link.title} <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-white py-16 px-6 border-t border-gray-100 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#3E2723]">
              <Coffee size={24} />
              <span className="font-black tracking-widest uppercase text-lg">BrewRank AI</span>
            </div>
            <p className="text-gray-500 max-w-sm">
              We empower coffee lovers with data-driven insights. Every score is calculated using real review sentiment analysis.
            </p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-sm font-bold text-gray-900">Built with Gemini 2.5 Flash</p>
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} BrewRank • All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
