import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { X, MapPin, Star, BarChart3, Sparkles } from 'lucide-react';
import { CoffeeShop, ComparisonData } from '../types';

interface ComparisonDashboardProps {
    selectedShops: CoffeeShop[];
    setSelectedShops: (shops: CoffeeShop[]) => void;
}

const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({ selectedShops, setSelectedShops }) => {
    const colors = ['#5D4037', '#8D6E63', '#A1887F', '#D7CCC8'];

    const comparisonData = useMemo(() => {
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
        ] as ComparisonData[];
    }, [selectedShops]);

    if (selectedShops.length === 0) return null;

    return (
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
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }} />
                                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#F8FAFC' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} />
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
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComparisonDashboard;
