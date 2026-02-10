import Link from 'next/link';
import { TimetableGrid } from '@/components/faculty/TimetableGrid';
import { CalendarDays, ChevronLeft } from 'lucide-react';

export default function FacultyBookingPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                        title="Back to Dashboard"
                    >
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Booking</h1>
                        <p className="text-slate-500 mt-1">Select a time slot to book a classroom or lab.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                    <CalendarDays size={16} />
                    <span>Weekly View</span>
                </div>
            </div>

            <TimetableGrid />
        </div>
    );
}
