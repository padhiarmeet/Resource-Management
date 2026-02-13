"use client";

import React, { useEffect, useState } from 'react';
import { BookingModal } from './BookingModal';
import { BookingDetailModal } from './BookingDetailModal';
import { Clock, Calendar, Plus, Coffee, UserCircle2, CheckCircle, Timer } from 'lucide-react';
import { fetchBookings } from '@/lib/api';

interface Booking {
    booking_id: number;
    startDatetime: string;
    endDatetime: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    user?: { user_id: number; name: string };
    resource?: {
        resource_id: number;
        resource_name: string;
        floor_number?: number;
        building?: { building_name: string };
        resourceType?: { type_name: string };
    };
}

export const TimetableGrid: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: string, startTime: string, endTime: string, dayName: string } | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const data = await fetchBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to load bookings", error);
        } finally {
            setLoading(false);
        }
    };

    // Check if a booking matches a slot
    const getBookingForSlot = (date: string, startTime: string) => {
        return bookings.find(b => {
            const bookingStart = b.startDatetime; // "2026-02-10T07:45:00"
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

    const handleBookingClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setDetailModalOpen(true);
    };

    const handleBookingSuccess = () => {
        loadBookings(); // Refresh bookings after any CRUD operation
    };

    // Status badge styling
    const statusStyles: Record<string, { card: string; badge: string }> = {
        APPROVED: {
            card: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50',
            badge: 'bg-emerald-100 text-emerald-700',
        },
        PENDING: {
            card: 'bg-amber-50 border-amber-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50',
            badge: 'bg-amber-100 text-amber-700',
        },
        REJECTED: {
            card: 'bg-rose-50 border-rose-200 hover:border-rose-300 hover:shadow-md hover:shadow-rose-100/50',
            badge: 'bg-rose-100 text-rose-700',
        },
    };

    // Skeleton loader for timetable
    if (loading) {
        return (
            <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                <div className="grid grid-cols-[80px_repeat(5,1fr)] bg-slate-100 border-b border-slate-200">
                    <div className="p-4"><div className="h-4 w-10 bg-slate-200 rounded mx-auto"></div></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 border-l border-slate-200 flex flex-col items-center gap-2">
                            <div className="h-3 w-8 bg-slate-200 rounded"></div>
                            <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                        </div>
                    ))}
                </div>
                {[...Array(3)].map((_, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[140px] border-b border-slate-100">
                        <div className="p-3 flex flex-col items-center pt-6 border-r border-slate-100">
                            <div className="h-4 w-10 bg-slate-200 rounded mb-4"></div>
                            <div className="h-3 w-10 bg-slate-100 rounded"></div>
                        </div>
                        {[...Array(5)].map((_, colIdx) => (
                            <div key={colIdx} className="p-4 border-l border-slate-100">
                                <div className="h-full rounded-md bg-slate-100 border border-slate-200"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

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

                        return (
                            <div key={idx} className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[140px] group">
                                <div className="p-3 flex flex-col items-center justify-start pt-6 border-r border-slate-100 bg-white">
                                    <span className="text-sm font-bold text-slate-700 font-mono">{row.start}</span>
                                    <div className="h-8 w-px bg-slate-200 my-2"></div>
                                    <span className="text-xs text-slate-400 font-mono">{row.end}</span>
                                </div>

                                {weekDays.map((day, dayIdx) => {
                                    const booking = getBookingForSlot(day.isoDate, row.start);
                                    const styles = booking ? (statusStyles[booking.status] || statusStyles.PENDING) : null;

                                    // Check if this slot is in the past
                                    const slotEnd = new Date(`${day.isoDate}T${row.end}:00`);
                                    const isPastSlot = slotEnd < new Date();

                                    return (
                                        <div
                                            key={`${day.name}-${idx}`}
                                            className={`p-4 border-l border-slate-100 relative transition-all duration-200 ${day.isToday && !booking ? 'bg-indigo-50/10' : ''}`}
                                        >
                                            {booking ? (
                                                <button
                                                    onClick={() => handleBookingClick(booking)}
                                                    className={`w-full h-full rounded-md border p-3 flex flex-col justify-between transition-all shadow-sm cursor-pointer text-left ${styles!.card}`}
                                                >
                                                    <div>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${styles!.badge}`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-800 line-clamp-1" title={booking.resource?.building?.building_name}>
                                                            {booking.resource?.building?.building_name || "Unknown Building"}
                                                        </p>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            {booking.resource?.resourceType?.type_name || booking.resource?.resource_name || "Resource"}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-2 border-t border-black/5 mt-2">
                                                        <UserCircle2 size={14} className="text-slate-400" />
                                                        <span className="text-xs text-slate-600 font-semibold truncate">
                                                            {booking.user?.name || "Unknown Faculty"}
                                                        </span>
                                                    </div>
                                                </button>
                                            ) : isPastSlot ? (
                                                <div className="w-full h-full rounded-md border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-1 opacity-50">
                                                    <Clock size={16} className="text-slate-300" />
                                                    <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Past</span>
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

            {/* Create Booking Modal */}
            <BookingModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    handleBookingSuccess();
                }}
                slot={selectedSlot}
            />

            {/* View/Update/Delete Booking Modal */}
            <BookingDetailModal
                isOpen={detailModalOpen}
                onClose={() => {
                    setDetailModalOpen(false);
                    setSelectedBooking(null);
                }}
                booking={selectedBooking}
                onUpdated={handleBookingSuccess}
            />
        </>
    );
};
