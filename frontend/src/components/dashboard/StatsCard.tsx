"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    alert?: boolean;
    loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    alert,
    loading
}) => {
    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start justify-between animate-pulse">
                <div>
                    <div className="h-3 w-24 bg-slate-200 rounded mb-3"></div>
                    <div className="h-7 w-16 bg-slate-200 rounded"></div>
                </div>
                <div className="p-2 rounded-lg bg-slate-100">
                    <div className="w-5 h-5"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 transition-all cursor-default group h-full">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-md ${alert ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500 group-hover:text-slate-700 group-hover:bg-slate-100'} transition-colors`}>
                    <Icon size={20} strokeWidth={2} />
                </div>
                {trend && (
                    <span
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full ${trend === "up"
                            ? "bg-emerald-50 text-emerald-600"
                            : trend === "down"
                                ? "bg-rose-50 text-rose-600"
                                : "bg-slate-50 text-slate-500"
                            }`}
                    >
                        {trendValue}
                    </span>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{value}</h3>
                <p className="text-sm font-medium text-slate-500">{title}</p>
            </div>
        </div>
    );
};
