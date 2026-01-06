import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { CoffeeShop } from '../types';

interface SourcesFooterProps {
    shops: CoffeeShop[];
    groundingUrls: { uri: string; title: string }[];
}

const SourcesFooter: React.FC<SourcesFooterProps> = ({ shops, groundingUrls }) => {
    if (shops.length === 0 || groundingUrls.length === 0) return null;

    return (
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
    );
};

export default SourcesFooter;
