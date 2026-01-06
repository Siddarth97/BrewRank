import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
    error: string;
    setHasSearched: (hasSearched: boolean) => void;
    setError: (error: string | null) => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, setHasSearched, setError }) => {
    return (
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
    );
};

export default ErrorState;
