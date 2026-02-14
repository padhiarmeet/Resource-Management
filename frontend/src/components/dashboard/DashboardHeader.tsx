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
                {/* Search removed as per new UI design */}
            </div>
        </header>
    );
};
