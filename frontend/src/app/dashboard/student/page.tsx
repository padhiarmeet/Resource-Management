"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BookOpen, Library, Monitor, Wifi, Clock, MapPin, ChevronRight, Loader2, GraduationCap, Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { fetchBookings, fetchResources } from "@/lib/api";

export default function StudentDashboard() {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("Student");
    const [greeting, setGreeting] = useState("Good morning");
    const [bookings, setBookings] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");

        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const user = JSON.parse(stored);
                setUserName(user.name || "Student");
            }
        } catch { }

        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [bData, rData] = await Promise.all([
                fetchBookings(),
                fetchResources(),
            ]);
            setBookings(bData || []);
            setResources(rData || []);
        } catch (err) {
            console.error("Failed to load student dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    // Today's timetable — approved bookings for today
    const now = new Date();
    const today = now.toDateString();
    const todayClasses = bookings
        .filter((b) => {
            const start = new Date(b.startDatetime);
            return start.toDateString() === today && b.status === "APPROVED";
        })
        .sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime());

    // Next class
    const upcoming = todayClasses.filter((b) => new Date(b.startDatetime) > now);
    const nextClass = upcoming[0];
    const nextClassMinutes = nextClass
        ? Math.max(0, Math.round((new Date(nextClass.startDatetime).getTime() - now.getTime()) / 60000))
        : null;

    // Resource availability: calculate which resources are currently free
    const activeBookingResourceIds = bookings
        .filter((b) => {
            const start = new Date(b.startDatetime);
            const end = new Date(b.endDatetime);
            return b.status === "APPROVED" && now >= start && now <= end;
        })
        .map((b) => b.resource?.resource_id);

    const freeResources = resources.filter((r: any) => !activeBookingResourceIds.includes(r.resource_id));
    const totalResources = resources.length;
    const freeCount = freeResources.length;

    // Categorize resources
    const resourceCategories = [
        {
            label: "Labs",
            icon: Monitor,
            color: "text-blue-600 bg-blue-50",
            count: resources.filter((r: any) => r.resource_type?.toLowerCase().includes("lab") || r.resource_name?.toLowerCase().includes("lab")).length,
            free: freeResources.filter((r: any) => r.resource_type?.toLowerCase().includes("lab") || r.resource_name?.toLowerCase().includes("lab")).length,
        },
        {
            label: "Library",
            icon: Library,
            color: "text-amber-600 bg-amber-50",
            count: resources.filter((r: any) => r.resource_type?.toLowerCase().includes("library") || r.resource_name?.toLowerCase().includes("library")).length,
            free: freeResources.filter((r: any) => r.resource_type?.toLowerCase().includes("library") || r.resource_name?.toLowerCase().includes("library")).length,
        },
        {
            label: "Rooms",
            icon: BookOpen,
            color: "text-emerald-600 bg-emerald-50",
            count: resources.filter((r: any) => !r.resource_name?.toLowerCase().includes("lab") && !r.resource_name?.toLowerCase().includes("library")).length,
            free: freeResources.filter((r: any) => !r.resource_name?.toLowerCase().includes("lab") && !r.resource_name?.toLowerCase().includes("library")).length,
        },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-64 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto p-8">
                    <DashboardHeader
                        title="Student Dashboard"
                        subtitle={
                            <span>{greeting}, <span className="font-semibold text-indigo-600">{userName}</span>. Here&apos;s your campus overview.</span>
                        }
                    />

                    {/* Hero: Next Class Banner */}
                    {!loading && nextClass && (
                        <div className="mb-8 rounded-lg bg-slate-900 p-6 text-white relative overflow-hidden ring-1 ring-slate-900/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-400 mb-1">Next Class Starts In</p>
                                    <h2 className="text-3xl font-bold tracking-tight">
                                        {nextClassMinutes !== null && nextClassMinutes > 0
                                            ? `${nextClassMinutes} minutes`
                                            : "Starting now"}
                                    </h2>
                                    <p className="text-slate-400 mt-2 text-sm flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-500" />
                                        <span className="text-slate-300">{nextClass.resource?.resource_name || "Unknown Room"}</span>
                                        <span className="text-slate-600">•</span>
                                        <span className="text-slate-400">{nextClass.resource?.building?.building_name || "Campus"}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-mono font-bold tracking-tighter text-indigo-400">
                                        {new Date(nextClass.startDatetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                    <p className="text-slate-500 text-sm mt-1 font-medium">
                                        Until {new Date(nextClass.endDatetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT: Timetable */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-base font-bold text-slate-800">Today&apos;s Timetable</h3>
                                    <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-md font-medium border border-slate-100">
                                        {now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                                    </span>
                                </div>
                                <div className="p-5">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-16">
                                            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                                        </div>
                                    ) : todayClasses.length === 0 ? (
                                        <div className="text-center py-16">
                                            <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 text-sm font-medium">No classes scheduled for today.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {todayClasses.map((b) => {
                                                const start = new Date(b.startDatetime);
                                                const end = new Date(b.endDatetime);
                                                const isOngoing = now >= start && now <= end;
                                                const isPast = now > end;

                                                return (
                                                    <div
                                                        key={b.booking_id}
                                                        className={`flex items-center gap-4 p-4 rounded-md border transition-all ${isOngoing
                                                            ? "bg-slate-50 border-indigo-200 ring-1 ring-indigo-500/10"
                                                            : isPast
                                                                ? "bg-white border-slate-100 opacity-60"
                                                                : "bg-white border-slate-100 hover:border-slate-300"
                                                            }`}
                                                    >
                                                        <div className={`w-1 h-10 rounded-full ${isOngoing ? "bg-indigo-600" : isPast ? "bg-slate-200" : "bg-slate-300"}`}></div>
                                                        <div className="min-w-[100px]">
                                                            <div className="text-sm font-bold text-slate-900">
                                                                {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </div>
                                                            <div className="text-xs text-slate-400">
                                                                {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-sm text-slate-800">{b.resource?.resource_name || "—"}</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                {b.resource?.building?.building_name || "Campus"} • {b.user?.name || "Professor"}
                                                            </p>
                                                        </div>
                                                        {isOngoing && (
                                                            <span className="text-[10px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-full animate-pulse">
                                                                LIVE
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                            {/* Resource Availability */}
                            <div className="bg-white rounded-lg border border-slate-200 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-bold text-slate-800">Resources</h3>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${freeCount > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'}`}>
                                        {loading ? "—" : `${freeCount} Available`}
                                    </span>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {resourceCategories.map((cat) => (
                                            <div key={cat.label} className="flex items-center gap-3 p-2.5 rounded-md bg-slate-50 border border-slate-100/50">
                                                <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-white border border-slate-100 text-slate-500`}>
                                                    <cat.icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold text-slate-700">{cat.label}</span>
                                                        <span className="text-[10px] font-bold text-slate-400">{cat.free}/{cat.count}</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-slate-600 rounded-full"
                                                            style={{ width: cat.count > 0 ? `${(cat.free / cat.count) * 100}%` : "0%" }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Link href="/dashboard/resource-bank" className="flex items-center justify-center p-2.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors mt-4">
                                            Browse All Resources
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Campus Services */}
                            <div className="bg-white rounded-lg border border-slate-200 p-5">
                                <h3 className="text-base font-bold text-slate-800 mb-4">Services</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Library", icon: Library, color: "text-slate-600" },
                                        { label: "Wi-Fi", icon: Wifi, color: "text-slate-600" },
                                        { label: "Notices", icon: Bell, color: "text-slate-600" },
                                        { label: "Portal", icon: ExternalLink, color: "text-slate-600" },
                                    ].map((svc) => (
                                        <div
                                            key={svc.label}
                                            className="flex flex-col items-center gap-2 p-3 rounded-md border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer group"
                                        >
                                            <svc.icon className={`w-5 h-5 ${svc.color} group-hover:text-indigo-600 transition-colors`} />
                                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">{svc.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
