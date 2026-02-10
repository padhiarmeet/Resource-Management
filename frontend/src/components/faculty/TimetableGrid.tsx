"use client";

import React, { useEffect, useState } from 'react';
import { BookingModal } from './BookingModal';
import { Clock, Calendar, Plus, Coffee, UserCircle2, CheckCircle, Timer } from 'lucide-react';
import { fetchBookings, Booking } from '@/lib/mockApi';

export const TimetableGrid: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: string, startTime: string, endTime: string, dayName: string } | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await fetchBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to load bookings", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to check if a slot is booked
    const getBookingForSlot = (date: string, startTime: string) => {
        return bookings.find(b => {
            // Mock logic: exact start time match on the same day
            // In production, would be date range overlap
            const bookingStart = b.start_datetime; // YYYY-MM-DDTHH:mm:SS
            const slotStart = `${date}T${startTime}:00`;
            return bookingStart === slotStart;
        });
    };

    const getWeekDays = () => {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + 1;
        const days = [];
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];

        for (let i = 0; i < 5; i++) {
            const next = new Date(curr.setDate(first + i));
            const isToday = new Date().toDateString() === next.toDateString();
            days.push({
                name: dayNames[i],
                fullName: next.toLocaleDateString('en-US', { weekday: 'long' }),
                dayNum: next.getDate(),
                date: next.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                isoDate: next.toISOString().split('T')[0],
                isToday
            });
        }
        return days;
    };

    const weekDays = getWeekDays();

    const timeline = [
        { type: 'slot', label: 'Slot 1', start: '07:45', end: '09:35' },
        { type: 'break', label: 'Morning Break', start: '09:35', end: '09:50' },
        { type: 'slot', label: 'Slot 2', start: '09:50', end: '11:30' },
        { type: 'break', label: 'Lunch Break', start: '11:30', end: '12:10' },
        { type: 'slot', label: 'Slot 3', start: '12:10', end: '13:50' },
    ];

    const handleSlotClick = (dayIndex: number, slot: typeof timeline[0]) => {
        const day = weekDays[dayIndex];
        setSelectedSlot({
            date: day.isoDate,
            startTime: slot.start,
            endTime: slot.end,
            dayName: day.fullName
        });
        setModalOpen(true);
    };

    const handleBookingSuccess = () => {
        loadBookings(); // Refresh bookings after a successful one
    };

    return (
        <>
            <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                {/* Header Row */}
                <div className="grid grid-cols-[80px_repeat(5,1fr)] bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                    <div className="p-4 flex flex-col justify-center items-center text-slate-700 font-bold text-sm uppercase tracking-wider">
                        Time
                    </div>
                    {weekDays.map((day) => (
                        <div key={day.name} className={`p-4 flex flex-col items-center justify-center border-l border-slate-200 ${day.isToday ? 'bg-indigo-50/50' : ''}`}>
                            <span className={`text-sm font-bold uppercase tracking-wider mb-1 ${day.isToday ? 'text-indigo-700' : 'text-slate-700'}`}>
                                {day.name}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${day.isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 bg-white border border-slate-200'}`}>
                                {day.dayNum}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Content */}
                <div className="divide-y divide-slate-100 bg-slate-50/30">
                    {timeline.map((row, idx) => {
                        const isBreak = row.type === 'break';

                        // Break Row Layout
                        if (isBreak) {
                            return (
                                <div key={idx} className="relative py-2 bg-slate-100/50 flex justify-center items-center border-b border-slate-200/60">
                                    <div className="absolute left-0 inset-y-0 w-[80px] flex items-center justify-center">
                                        <div className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                                            {row.start}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wide">
                                        <Coffee size={14} />
                                        <span>{row.label}</span>
                                        <span className="opacity-50 mx-1">•</span>
                                        <span>{row.end}</span>
                                    </div>
                                </div>
                            );
                        }

                        // Slot Row Layout
                        return (
                            <div key={idx} className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[140px] group">
                                {/* Time Column */}
                                <div className="p-3 flex flex-col items-center justify-start pt-6 border-r border-slate-100 bg-white">
                                    <span className="text-sm font-bold text-slate-700 font-mono">{row.start}</span>
                                    <div className="h-8 w-px bg-slate-200 my-2"></div>
                                    <span className="text-xs text-slate-400 font-mono">{row.end}</span>
                                </div>

                                {/* Days Columns */}
                                {weekDays.map((day, dayIdx) => {
                                    const booking = getBookingForSlot(day.isoDate, row.start);

                                    return (
                                        <div
                                            key={`${day.name}-${idx}`}
                                            className={`p-4 border-l border-slate-100 relative transition-all duration-200 ${day.isToday && !booking ? 'bg-indigo-50/10' : ''}`}
                                        >
                                            {booking ? (
                                                <div className={`w-full h-full rounded-md border p-3 flex flex-col justify-between transition-all shadow-sm ${booking.status === 'APPROVED'
                                                        ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                                                        : 'bg-amber-50 border-amber-200 hover:border-amber-300'
                                                    }`}>
                                                    <div>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${booking.status === 'APPROVED'
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-800 line-clamp-1" title={booking.building_name}>
                                                            {booking.building_name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            {booking.resource_type}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-2 border-t border-black/5 mt-2">
                                                        <UserCircle2 size={14} className="text-slate-400" />
                                                        <span className="text-xs text-slate-600 font-semibold truncate">
                                                            {booking.faculty_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleSlotClick(dayIdx, row)}
                                                    className="w-full h-full rounded-md border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-100/50 transition-all duration-200 group/slot flex flex-col items-center justify-center gap-2"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 group-hover/slot:bg-indigo-50 text-slate-300 group-hover/slot:text-indigo-600 flex items-center justify-center transition-colors">
                                                        <Plus size={20} />
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-400 group-hover/slot:text-indigo-600">
                                                        Book This Slot
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            <BookingModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    handleBookingSuccess(); // Ideally only on success, but for now simple refresh
                }}
                slot={selectedSlot}
            />
        </>
    );
};
