import React, { useState, useMemo } from 'react';
import { analyzeCoffeeShops } from './services/geminiService';
import { CoffeeShop } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Highlights from './components/Highlights';
import SortBar, { SortKey } from './components/SortBar';
import ShopGrid from './components/ShopGrid';
import ComparisonDashboard from './components/ComparisonDashboard';
import FloatingActionBar from './components/FloatingActionBar';
import SourcesFooter from './components/SourcesFooter';
import Footer from './components/Footer';

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

    return (
        <div className="min-h-screen flex flex-col selection:bg-amber-200">
            <Header
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
                loading={loading}
            />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10 space-y-12">
                {!hasSearched && !loading && !error && (
                    <Hero setQuery={setQuery} handleSearch={handleSearch} />
                )}

                {loading && <LoadingState query={query} />}

                {error && (
                    <ErrorState
                        error={error}
                        setHasSearched={setHasSearched}
                        setError={setError}
                    />
                )}

                {shops.length > 0 && !loading && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <Highlights highlights={highlights} />

                        <SortBar
                            shopsCount={shops.length}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                        />

                        <ShopGrid
                            sortedShops={sortedShops}
                            selectedShops={selectedShops}
                            toggleSelection={toggleSelection}
                            highlights={highlights}
                        />

                        <ComparisonDashboard
                            selectedShops={selectedShops}
                            setSelectedShops={setSelectedShops}
                        />
                    </div>
                )}
            </main>

            <FloatingActionBar selectedShops={selectedShops} />

            <SourcesFooter shops={shops} groundingUrls={groundingUrls} />

            <Footer />
        </div>
    );
};

export default App;
