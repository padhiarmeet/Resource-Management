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
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start justify-between hover:border-indigo-300 transition-colors cursor-default group">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                    {trend && (
                        <span
                            className={`text-xs font-medium px-1.5 py-0.5 rounded ${trend === "up"
                                ? "bg-emerald-50 text-emerald-600"
                                : trend === "down"
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            {trendValue}
                        </span>
                    )}
                </div>
            </div>
            <div className={`p-2 rounded-lg ${alert ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50'} transition-colors`}>
                <Icon size={20} />
            </div>
        </div>
    );
};
