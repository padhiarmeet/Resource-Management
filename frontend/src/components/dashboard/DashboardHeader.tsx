"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const DashboardHeader: React.FC = () => {
    const [greeting, setGreeting] = useState("Good morning");
    const [facultyName, setFacultyName] = useState("Priya Sharma"); // Hardcoded for now until auth is connected

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <header className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {greeting}, <span className="font-semibold text-indigo-600">{facultyName} Sir</span>.
                </p>
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
                <Button className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                    <Plus size={16} />
                    New Booking
                </Button>
            </div>
        </header>
    );
};
