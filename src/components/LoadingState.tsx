import React from 'react';
import { Loader2, Coffee } from 'lucide-react';

interface LoadingStateProps {
    query: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ query }) => {
    return (
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
    );
};

export default LoadingState;
