import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookingTimeline } from "@/components/dashboard/BookingTimeline";
import { MaintenanceWidget } from "@/components/dashboard/MaintenanceWidget";
import { ResourceChart } from "@/components/dashboard/ResourceChart";
import {
    Users,
    BookOpen,
    CalendarCheck,
    MonitorCheck,
    Bell
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">

            {/* Sidebar (Fixed width) */}
            <Sidebar />

            {/* Main Content (Offset by sidebar width) */}
            <main className="flex-1 ml-64 min-w-0">
                <div className="max-w-[1600px] mx-auto p-8">

                    {/* Header */}
                    <DashboardHeader />

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatsCard
                            title="Total Resources"
                            value="1,240"
                            icon={MonitorCheck}
                            trend="up"
                            trendValue="+12%"
                        />
                        <StatsCard
                            title="Active Bookings"
                            value="86"
                            icon={CalendarCheck}
                            trend="up"
                            trendValue="+4"
                        />
                        <StatsCard
                            title="Issues Reported"
                            value="3"
                            icon={Bell}
                            trend="down"
                            trendValue="-1"
                            alert
                        />
                        <StatsCard
                            title="Departments"
                            value="12"
                            icon={BookOpen}
                        />
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Main Interaction Area (Timeline) */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-bold text-slate-800 mb-4">Live Schedule</h3>
                                <BookingTimeline />
                            </div>
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[300px]">
                                <ResourceChart />
                            </div>
                        </div>

                        {/* Right Rail (Widgets) */}
                        <div className="space-y-6">
                            <MaintenanceWidget />

                            {/* QUICK ACTIONS WIDGET */}
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg">
                                <h3 className="font-bold text-lg mb-2">Need a Lab?</h3>
                                <p className="text-indigo-100 text-sm mb-4">Quickly book a computer lab for your upcoming session.</p>
                                <button className="w-full py-2 bg-white text-indigo-700 font-semibold rounded-lg text-sm hover:bg-indigo-50 transition-colors">Book Now</button>
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
