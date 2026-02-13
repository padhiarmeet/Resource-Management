"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface DashboardHeaderProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="flex justify-between items-start mb-8">
            <div>
                {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
                {subtitle && <div className="text-sm text-slate-500 mt-1">{subtitle}</div>}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 shadow-sm"
                    />
                </div>
            </div>
        </header>
    );
};
