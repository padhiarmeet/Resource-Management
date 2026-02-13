"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookingTimeline, TimelineEvent } from "@/components/dashboard/BookingTimeline";
import { MaintenanceWidget, MaintenanceIssue } from "@/components/dashboard/MaintenanceWidget";
import { ResourceChart, ResourceChartData } from "@/components/dashboard/ResourceChart";
import {
    Users,
    BookOpen,
    CalendarCheck,
    MonitorCheck,
    Bell
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { fetchBookings, fetchResources, fetchMaintenance, fetchCupboards } from "@/lib/api";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    // Stats
    const [totalResources, setTotalResources] = useState(0);
    const [activeBookings, setActiveBookings] = useState(0);
    const [issuesReported, setIssuesReported] = useState(0);
    const [totalBuildings, setTotalBuildings] = useState(0);

    // Timeline
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

    // Maintenance
    const [maintenanceIssues, setMaintenanceIssues] = useState<MaintenanceIssue[]>([]);

    // Resource Chart
    const [chartData, setChartData] = useState<ResourceChartData>({
        totalResources: 0,
        bookedResources: 0,
        classrooms: 0,
        labs: 0,
        auditoriums: 0,
        meetingRooms: 0,
    });

    // Greeting
    const [greeting, setGreeting] = useState("Good morning");
    const facultyName = "Priya Sharma"; // Hardcoded for now

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [bookings, resources, maintenance] = await Promise.all([
                    fetchBookings(),
                    fetchResources(),
                    fetchMaintenance(),
                ]);

                // --- Stats ---
                setTotalResources(resources.length);

                const now = new Date();
                const approved = bookings.filter((b: any) => b.status === "APPROVED");
                const pending = bookings.filter((b: any) => b.status === "PENDING");
                setActiveBookings(approved.length + pending.length);

                const openIssues = maintenance.filter((m: any) => m.status !== "COMPLETED");
                setIssuesReported(openIssues.length);

                // Count unique buildings from resources
                const buildingSet = new Set<number>();
                resources.forEach((r: any) => {
                    if (r.building?.building_id) buildingSet.add(r.building.building_id);
                });
                setTotalBuildings(buildingSet.size);

                // --- Timeline Events ---
                const events: TimelineEvent[] = bookings.map((b: any) => {
                    const start = new Date(b.startDatetime);
                    const end = new Date(b.endDatetime);

                    let status: "live" | "upcoming" | "completed" = "upcoming";
                    if (b.status === "APPROVED" && now >= start && now <= end) {
                        status = "live";
                    } else if (now > end) {
                        status = "completed";
                    }

                    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return {
                        id: String(b.booking_id),
                        time: `${startTime} - ${endTime}`,
                        title: b.resource?.resource_name || "Unknown Resource",
                        location: b.resource?.building?.building_name
                            ? `${b.resource.building.building_name}, Floor ${b.resource.floor_number}`
                            : "Unknown Location",
                        status,
                    };
                });
                setTimelineEvents(events);

                // --- Maintenance ---
                const issues: MaintenanceIssue[] = maintenance.map((m: any) => ({
                    id: m.maintenance_id,
                    type: m.maintenance_type,
                    notes: m.notes || "",
                    status: m.status,
                    scheduledDate: m.scheduled_date,
                    resourceName: m.resource?.resource_name || "Unknown",
                }));
                setMaintenanceIssues(issues);

                // --- Resource Chart ---
                const counts = { classrooms: 0, labs: 0, auditoriums: 0, meetingRooms: 0 };
                resources.forEach((r: any) => {
                    const type = r.resourceType?.type_name || "";
                    if (type.includes("Classroom")) counts.classrooms++;
                    else if (type.includes("Lab")) counts.labs++;
                    else if (type.includes("Auditorium")) counts.auditoriums++;
                    else if (type.includes("Meeting")) counts.meetingRooms++;
                });

                setChartData({
                    totalResources: resources.length,
                    bookedResources: approved.length,
                    ...counts,
                });
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">

            {/* Sidebar (Fixed width) */}
            <Sidebar />

            {/* Main Content (Offset by sidebar width) */}
            <main className="flex-1 ml-64 min-w-0">
                <div className="max-w-[1600px] mx-auto p-8">

                    {/* Header */}
                    <DashboardHeader
                        title="Dashboard"
                        subtitle={
                            <span>{greeting}, <span className="font-semibold text-indigo-600">{facultyName} Sir</span>.</span>
                        }
                    />

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatsCard
                            title="Total Resources"
                            value={totalResources}
                            icon={MonitorCheck}
                            loading={loading}
                        />
                        <StatsCard
                            title="Active Bookings"
                            value={activeBookings}
                            icon={CalendarCheck}
                            loading={loading}
                        />
                        <StatsCard
                            title="Issues Reported"
                            value={issuesReported}
                            icon={Bell}
                            alert={issuesReported > 0}
                            loading={loading}
                        />
                        <StatsCard
                            title="Buildings"
                            value={totalBuildings}
                            icon={BookOpen}
                            loading={loading}
                        />
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Main Interaction Area (Timeline) */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-bold text-slate-800 mb-4">All Schedules</h3>
                                <BookingTimeline events={timelineEvents} loading={loading} />
                            </div>
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[300px]">
                                <ResourceChart data={chartData} loading={loading} />
                            </div>
                        </div>

                        {/* Right Rail (Widgets) */}
                        <div className="space-y-6">
                            <MaintenanceWidget issues={maintenanceIssues} loading={loading} />

                            {/* QUICK ACTIONS WIDGET */}
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg">
                                <h3 className="font-bold text-lg mb-2">Need a Lab?</h3>
                                <p className="text-indigo-100 text-sm mb-4">Quickly book a computer lab for your upcoming session.</p>
                                <Link href="/dashboard/faculty/booking" className="block w-full py-2 bg-white text-indigo-700 font-semibold rounded-lg text-sm hover:bg-indigo-50 transition-colors text-center">Book Now</Link>
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
