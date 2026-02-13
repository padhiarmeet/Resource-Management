"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
    BookOpen,
    LayoutDashboard,
    Users,
    GraduationCap,
    Clock,
    HardDrive
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchBookings, fetchResources, fetchCupboards } from "@/lib/api";

export default function Home() {
    const [stats, setStats] = useState({
        liveNow: null as any,
        approvedBookings: 0,
        pendingBookings: 0,
        emptySlots: 0, // This is hard to calculate without a fixed total, we'll use a placeholder or derived value
        resourceCounts: {
            Auditorium: 0,
            Classroom: 0,
            Lab: 0,
            "Meeting Room": 0
        },
        totalResources: 0,
        cupboardCount: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [bookings, resources, cupboards] = await Promise.all([
                    fetchBookings(),
                    fetchResources(),
                    fetchCupboards()
                ]);

                // Process Bookings
                const now = new Date();
                let live = null;
                let approved = 0;
                let pending = 0;

                bookings.forEach((b: any) => {
                    const start = new Date(b.startDatetime);
                    const end = new Date(b.endDatetime);

                    if (b.status === "APPROVED") approved++;
                    if (b.status === "PENDING") pending++;

                    if (b.status === "APPROVED" && now >= start && now <= end) {
                        live = b;
                    }
                });

                // Process Resources
                const counts: any = { Auditorium: 0, Classroom: 0, Lab: 0, "Meeting Room": 0 };
                resources.forEach((r: any) => {
                    // Adjust type matching based on actual DB values (e.g., "Classroom", "Laboratory")
                    const type = r.resourceType?.type_name || "Unknown";
                    // Simple fuzzy matching or direct mapping
                    if (type.includes("Classroom")) counts.Classroom++;
                    else if (type.includes("Lab")) counts.Lab++;
                    else if (type.includes("Auditorium")) counts.Auditorium++;
                    else if (type.includes("Meeting")) counts["Meeting Room"]++;
                });

                setStats({
                    liveNow: live,
                    approvedBookings: approved,
                    pendingBookings: pending,
                    emptySlots: 5, // Placeholder/Mock for now as "Empty" implies unbooked slots in a schedule, which is complex
                    resourceCounts: counts,
                    totalResources: resources.length,
                    cupboardCount: cupboards.length
                });

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Helper to format time
    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans text-slate-900">

            {/* Main Container - The "Glass" Card effect */}
            <div className="w-full max-w-[1400px] min-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200">

                {/* LEFT SIDE: Action Area (Login/Signup) */}
                <div className="w-full lg:w-[40%] p-12 lg:p-20 flex flex-col justify-center relative z-10">

                    {/* Logo / Brand */}
                    <div className="flex items-center gap-3 mb-12">
                        <Image src="/app_logo.png" alt="OpenSlot Logo" width={48} height={48} />
                        <span className="text-xl font-bold tracking-tight text-slate-900">OpenSlot</span>
                    </div>

                    {/* Hero Text */}
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                        Campus life, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
                            organized.
                        </span>
                    </h1>

                    <p className="text-slate-500 text-lg mb-10 max-w-md leading-relaxed">
                        The central hub for faculties and students. Manage lecture schedules, digital cupboards, and library assets in one dashboard.
                    </p>

                    {/* THE BUTTONS - Main Focus */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button className="w-full h-14 px-8 text-lg rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02]">
                                Login to Portal
                            </Button>
                        </Link>
                        <Link href="/signup" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 transition-all">
                                New Account
                            </Button>
                        </Link>
                    </div>

                    {/* Footer Text */}
                    <div className="mt-12 flex items-center gap-4 text-xs font-medium text-slate-400">
                        <span>Faculties</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span>Students</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span>Admin</span>
                    </div>
                </div>

                {/* RIGHT SIDE: The Visual */}
                <div className="hidden lg:flex w-[60%] bg-[#F8FAFC] relative p-12 items-center justify-center overflow-hidden">

                    {/* Abstract Background Blobs */}
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-pink-100/50 rounded-full blur-3xl"></div>

                    {/* THE DASHBOARD MOCKUP */}
                    <div className="relative w-full max-w-[800px] aspect-[16/10] bg-white rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-200/60 p-2 flex overflow-hidden">

                        {/* 1. Sidebar */}
                        <div className="w-20 bg-[#1A1F2C] rounded-2xl flex flex-col items-center py-8 gap-8 shrink-0 text-slate-400">
                            <div className="p-2 bg-slate-800 rounded-lg text-white"><LayoutDashboard size={20} /></div>
                            <div className="flex flex-col gap-6 w-full items-center">
                                <div className="p-2 hover:text-white cursor-pointer"><Users size={20} /></div>
                                <div className="p-2 text-white bg-white/10 rounded-lg"><BookOpen size={20} /></div>
                                <div className="p-2 hover:text-white cursor-pointer"><GraduationCap size={20} /></div>
                            </div>
                        </div>

                        {/* 2. Main Content Area */}
                        <div className="flex-1 p-6 flex flex-col gap-6 bg-white rounded-r-2xl">

                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Resource Dashboard</h3>
                                    <p className="text-xs text-slate-400">Welcome back, Professor.</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-4 py-2 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">Academic Year 2026</span>
                                </div>
                            </div>

                            {/* Bento Grid */}
                            <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">

                                {/* Card: Current Lecture (Takes 2 cols) */}
                                <div className="col-span-2 bg-[#F3F5F7] rounded-[1.5rem] p-5 flex flex-col justify-between group hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-white rounded-full shadow-sm text-pink-500"><Clock size={18} /></div>
                                        {stats.liveNow ? (
                                            <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-full">Live Now</span>
                                        ) : (
                                            <span className="bg-slate-300 text-slate-600 text-[10px] px-2 py-1 rounded-full">No Active Session</span>
                                        )}
                                    </div>
                                    <div>
                                        {stats.liveNow ? (
                                            <>
                                                <h4 className="text-3xl font-bold text-slate-800 mb-1">{formatTime(stats.liveNow.startDatetime)}</h4>
                                                <p className="text-sm text-slate-500 font-medium">
                                                    {stats.liveNow.resource?.resource_name || "Unknown Resource"} • {stats.liveNow.user?.name || "Faculty"}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="text-3xl font-bold text-slate-800 mb-1">--:--</h4>
                                                <p className="text-sm text-slate-500 font-medium">No sessions currently running.</p>
                                            </>
                                        )}
                                    </div>
                                    {/* Fake timeline bars */}
                                    <div className="flex gap-1 h-2 mt-4">
                                        <div className="w-1/3 bg-pink-400 rounded-full"></div>
                                        <div className="w-2/3 bg-slate-200 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Card: Storage / Cupboard */}
                                <div className="col-span-1 bg-[#1A1F2C] rounded-[1.5rem] p-5 text-white flex flex-col justify-between relative overflow-hidden">
                                    {/* Decorative blob */}
                                    <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-blue-500 blur-2xl opacity-40"></div>

                                    <div className="flex items-center gap-2 text-slate-300">
                                        <HardDrive size={16} />
                                        <span className="text-xs font-semibold">Cupboards</span>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold mb-1">{stats.cupboardCount}</div>
                                        <div className="text-[10px] text-slate-400">Total Storage Units</div>
                                    </div>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-400 h-full w-[60%]"></div>
                                    </div>
                                </div>

                                {/* Card: Resource Types (Auditorium, Classroom, Lab) */}
                                <div className="col-span-1 bg-white border border-slate-100 rounded-[1.5rem] p-5 flex flex-col justify-between">
                                    <div className="text-sm font-semibold text-slate-600 mb-3">Resource Types</div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                                                <span className="text-slate-700">Auditorium</span>
                                            </div>
                                            <span className="font-bold text-slate-900">{stats.resourceCounts.Auditorium}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-slate-700">Classroom</span>
                                            </div>
                                            <span className="font-bold text-slate-900">{stats.resourceCounts.Classroom}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                                <span className="text-slate-700">Lab</span>
                                            </div>
                                            <span className="font-bold text-slate-900">{stats.resourceCounts.Lab}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-slate-400 text-right">Total: {stats.totalResources}</div>
                                </div>

                                {/* Card: Booking Status (Pending, Approved, Empty) */}
                                <div className="col-span-2 bg-[#F3F5F7] rounded-[1.5rem] p-5 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-slate-800">Booking Status</h4>
                                        <button className="text-xs text-indigo-600 font-medium hover:underline">Manage</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Approved */}
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1">
                                            <div className="text-lg font-bold text-green-600">{stats.approvedBookings}</div>
                                            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Approved</div>
                                        </div>
                                        {/* Pending */}
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1">
                                            <div className="text-lg font-bold text-amber-500">{stats.pendingBookings}</div>
                                            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Pending</div>
                                        </div>
                                        {/* Empty/Available */}
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1">
                                            <div className="text-lg font-bold text-slate-400">{stats.emptySlots}</div>
                                            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Empty</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
