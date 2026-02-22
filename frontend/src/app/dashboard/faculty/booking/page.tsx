"use client";

import { TimetableGrid } from '@/components/faculty/TimetableGrid';
import { CalendarDays } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function FacultyBookingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">

            {/* Sidebar (Fixed width, same as Dashboard) */}
            <Sidebar />

            {/* Main Content (Offset by sidebar width) */}
            <main className="flex-1 ml-64 min-w-0">
                <div className="max-w-[1600px] mx-auto p-8 pt-4">

                    {/* Page Title */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Booking</h1>
                            <p className="text-slate-500 mt-1">Select a time slot to book a classroom or lab.</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                            <CalendarDays size={16} />
                            <span>Weekly View</span>
                        </div>
                    </div>

                    <TimetableGrid />
                </div>
            </main>
        </div>
    );
}
