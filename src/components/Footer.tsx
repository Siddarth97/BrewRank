import React from 'react';
import { Coffee } from 'lucide-react';

const Footer: React.FC = () => {
    return (
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
    );
};

export default Footer;
