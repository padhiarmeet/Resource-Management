"use client";

import React from "react";
import { Search, Filter, Warehouse, Layers } from "lucide-react";

interface ResourceFiltersProps {
    filters: {
        search: string;
        type: string;
        building: string;
    };
    onFilterChange: (key: string, value: string) => void;
    types: string[];
    buildings: string[];
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
    filters,
    onFilterChange,
    types,
    buildings
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search resources..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                    value={filters.search}
                    onChange={(e) => onFilterChange("search", e.target.value)}
                />
            </div>

            {/* Dropdowns */}
            <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-1 md:pb-0">

                {/* Type Filter */}
                <div className="relative min-w-[160px]">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                        className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer hover:bg-slate-50 transition-colors"
                        value={filters.type}
                        onChange={(e) => onFilterChange("type", e.target.value)}
                    >
                        <option value="">All Types</option>
                        {types.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                </div>

                {/* Building Filter */}
                <div className="relative min-w-[160px]">
                    <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                        className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer hover:bg-slate-50 transition-colors"
                        value={filters.building}
                        onChange={(e) => onFilterChange("building", e.target.value)}
                    >
                        <option value="">All Buildings</option>
                        {buildings.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                </div>

            </div>
        </div>
    );
};
