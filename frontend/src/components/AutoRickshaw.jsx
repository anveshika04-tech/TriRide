import React from 'react';

const AutoRickshaw = () => {
    return (
        <div className="relative w-full h-full">
            {/* Auto body */}
            <div className="absolute inset-0 bg-emerald-500 rounded-lg transform -skew-x-12">
                {/* Yellow top */}
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-yellow-400 rounded-t-lg" />
                {/* Windows */}
                <div className="absolute top-1/4 left-1/4 right-1/4 h-1/3 bg-white/30 rounded" />
                {/* Wheels */}
                <div className="absolute bottom-0 left-1/4 w-12 h-12 bg-black rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-12 h-12 bg-black rounded-full" />
            </div>
        </div>
    );
};

export default AutoRickshaw; 