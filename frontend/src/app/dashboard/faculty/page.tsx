"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BookOpen, Clock, Calendar, AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchBookingsByUser, fetchMaintenance } from "@/lib/api";

interface BookingData {
    booking_id: number;
    status: string;
    startDatetime: string;
    endDatetime: string;
    resource: {
        resource_name: string;
        building?: { building_name: string };
        floor_number?: number;
    };
    createdAt: string;
}

export default function FacultyDashboard() {
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [userName, setUserName] = useState("Faculty");
    const [greeting, setGreeting] = useState("Good morning");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");

        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const user = JSON.parse(stored);
                setUserName(user.name || "Faculty");
                loadData(user.userId);
            } else {
                setLoading(false);
            }
        } catch {
            setLoading(false);
        }
    }, []);

    const loadData = async (userId: number) => {
        try {
            const [bookingsData, maintenanceData] = await Promise.all([
                fetchBookingsByUser(userId),
                fetchMaintenance(),
            ]);
            setBookings(bookingsData || []);

            // Build notifications from recent bookings
            const recentNotifs = (bookingsData || [])
                .filter((b: BookingData) => b.status === "APPROVED" || b.status === "REJECTED")
                .sort((a: BookingData, b: BookingData) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .slice(0, 3)
                .map((b: BookingData) => ({
                    id: b.booking_id,
                    message: `${b.resource?.resource_name || "Resource"} Booking ${b.status === "APPROVED" ? "Approved" : "Rejected"}`,
                    detail: `${new Date(b.startDatetime).toLocaleDateString()} at ${new Date(b.startDatetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
                    color: b.status === "APPROVED" ? "bg-emerald-500" : "bg-red-500",
                    time: getRelativeTime(b.createdAt),
                }));

            // Add maintenance notifications
            const maintenanceNotifs = (maintenanceData || [])
                .filter((m: any) => m.status === "PENDING")
                .slice(0, 2)
                .map((m: any) => ({
                    id: `m-${m.maintenance_id}`,
                    message: `Maintenance Scheduled`,
                    detail: `${m.maintenance_type} on ${m.resource?.resource_name || "Resource"}`,
                    color: "bg-amber-500",
                    time: m.scheduled_date,
                }));

            setNotifications([...recentNotifs, ...maintenanceNotifs].slice(0, 4));
        } catch (err) {
            console.error("Failed to load faculty dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRelativeTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    // Compute stats
    const now = new Date();
    const today = now.toDateString();

    const todayBookings = bookings.filter((b) => {
        const start = new Date(b.startDatetime);
        return start.toDateString() === today;
    });

    const upcomingToday = todayBookings
        .filter((b) => new Date(b.startDatetime) > now && (b.status === "APPROVED" || b.status === "PENDING"))
        .sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime());

    const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
    const approvedCount = bookings.filter((b) => b.status === "APPROVED").length;

    const nextClass = upcomingToday[0];
    const nextClassMinutes = nextClass
        ? Math.max(0, Math.round((new Date(nextClass.startDatetime).getTime() - now.getTime()) / 60000))
        : null;

    // Today's schedule (approved + pending for today)
    const todaySchedule = todayBookings
        .filter((b) => b.status === "APPROVED" || b.status === "PENDING")
        .sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime());

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-64 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto p-8">
                    <DashboardHeader
                        title="Faculty Dashboard"
                        subtitle={
                            <span>{greeting}, <span className="font-semibold text-indigo-600">{userName}</span>.</span>
                        }
                    />

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard label="Upcoming Classes" value={loading ? "—" : String(upcomingToday.length)} icon={BookOpen} color="indigo" />
                        <StatCard label="Pending Requests" value={loading ? "—" : String(pendingCount)} icon={Clock} color="amber" />
                        <StatCard label="Approved Bookings" value={loading ? "—" : String(approvedCount)} icon={CheckCircle2} color="emerald" />
                        <StatCard label="Next Class In" value={loading ? "—" : nextClassMinutes !== null ? `${nextClassMinutes}m` : "—"} icon={Calendar} color="blue" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Schedule */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-base font-bold text-slate-800">Today&apos;s Schedule</h3>
                                    <Link href="/dashboard/faculty/booking" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                        View Full Schedule <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="p-6">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                                        </div>
                                    ) : todaySchedule.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-500 text-sm">No classes scheduled for today.</p>
                                            <Link href="/dashboard/faculty/booking" className="text-indigo-600 text-sm font-semibold mt-2 inline-block hover:underline">
                                                Book a session →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {todaySchedule.map((booking, idx) => {
                                                const start = new Date(booking.startDatetime);
                                                const end = new Date(booking.endDatetime);
                                                const isOngoing = now >= start && now <= end;
                                                const isPast = now > end;

                                                return (
                                                    <div
                                                        key={booking.booking_id}
                                                        className={`flex items-start gap-4 p-4 rounded-md relative group transition-colors ${isOngoing
                                                            ? "bg-slate-50 border border-indigo-200"
                                                            : isPast
                                                                ? "bg-white border border-slate-100 opacity-60"
                                                                : "bg-white border border-slate-100 hover:border-slate-300"
                                                            }`}
                                                    >
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-md ${isOngoing ? "bg-indigo-600" : isPast ? "bg-slate-200" : "bg-slate-300"}`}></div>
                                                        <div className="min-w-[80px] text-center">
                                                            <div className="text-sm font-bold text-slate-900">
                                                                {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900">{booking.resource?.resource_name || "Unknown Resource"}</h4>
                                                            <p className="text-sm text-slate-500 mb-2">
                                                                {booking.resource?.building?.building_name || "Unknown Building"}
                                                                {booking.resource?.floor_number ? ` • Floor ${booking.resource.floor_number}` : ""}
                                                            </p>
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${isOngoing
                                                                ? "bg-indigo-100 text-indigo-700"
                                                                : booking.status === "APPROVED"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                                }`}>
                                                                {isOngoing ? "Ongoing" : booking.status === "APPROVED" ? "Confirmed" : "Pending"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Quick Actions & Notifications */}
                        <div className="space-y-6">
                            {/* Quick Book Widget */}
                            <div className="bg-slate-900 rounded-lg p-6 text-white border border-slate-800">
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold mb-2">Quick Book</h3>
                                    <p className="text-slate-400 text-sm mb-6">Instantly reserve a lab or room for ad-hoc sessions.</p>
                                    <div className="space-y-3">
                                        <Link href="/dashboard/faculty/booking" className="w-full py-2.5 px-4 rounded-md bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors text-left flex items-center justify-between group">
                                            Book Computer Lab
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                        <Link href="/dashboard/faculty/booking" className="w-full py-2.5 px-4 rounded-md bg-white/5 text-slate-300 border border-slate-700 text-sm font-semibold hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
                                            Book Seminar Hall
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-white rounded-lg border border-slate-200 p-6">
                                <h3 className="text-base font-bold text-slate-800 mb-4">Notifications</h3>
                                {loading ? (
                                    <div className="flex justify-center py-6">
                                        <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-6">No notifications yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="flex gap-3">
                                                <div className={`mt-1.5 w-2 h-2 rounded-full ${notif.color} shrink-0`}></div>
                                                <div>
                                                    <p className="text-sm text-slate-800 font-medium">{notif.message}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{notif.detail}</p>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Reusable stat card
function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
    return (
        <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-slate-50 rounded-md text-slate-500">
                    <Icon size={18} />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
            </div>
        </div>
    );
}
