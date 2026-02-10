import React from "react";

export const ResourceChart: React.FC = () => {
    // Re-doing the chart to be more "Summary" focused
    return (
        <div className="h-full flex flex-col">
            <h3 className="text-base font-bold text-slate-800 mb-6">Resource Allocation</h3>

            <div className="flex justify-center items-center flex-1">
                {/* CSS Donut Chart (Simulated) */}
                <div className="relative w-40 h-40 rounded-full border-[12px] border-slate-100 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Blue segment */}
                        <circle cx="50" cy="50" r="40" stroke="#4f46e5" strokeWidth="8" fill="none" strokeDasharray="180 251" />
                        {/* Violet segment */}
                        <circle cx="50" cy="50" r="40" stroke="#8b5cf6" strokeWidth="8" fill="none" strokeDasharray="60 251" strokeDashoffset="-180" />
                    </svg>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">82%</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Booked</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                        <span className="text-xs text-slate-500">Classrooms</span>
                    </div>
                    <span className="font-bold text-slate-800">12 / 16</span>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                        <span className="text-xs text-slate-500">Labs</span>
                    </div>
                    <span className="font-bold text-slate-800">5 / 8</span>
                </div>
            </div>
        </div>
    );
};
