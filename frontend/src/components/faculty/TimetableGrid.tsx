"use client";

import React, { useEffect, useState } from 'react';
import { BookingModal } from './BookingModal';
import { BookingDetailModal } from './BookingDetailModal';
import { Clock, Calendar, Plus, Coffee, UserCircle2, CheckCircle, Timer } from 'lucide-react';
import { fetchBookings, fetchBuildings } from '@/lib/api';

// Also add a Building interface at the top
interface Building {
    building_id: number;
    building_name: string;
}

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
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | 'ALL'>('ALL');
    const [loading, setLoading] = useState(true);

    // State for current week view
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
        const curr = new Date();
        const day = curr.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday

        // If today is Saturday (6) or Sunday (0), show next week's Monday
        // Otherwise, show this week's Monday
        const daysUntilMonday = day === 0 ? 1 : (day === 6 ? 2 : 1 - day);

        const nextMonday = new Date(curr);
        nextMonday.setDate(curr.getDate() + daysUntilMonday);
        return nextMonday;
    });

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const [bookingsData, buildingsData] = await Promise.all([
                fetchBookings(),
                fetchBuildings()
            ]);
            setBookings(bookingsData);
            setBuildings(buildingsData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    // Navigation handlers
    const handlePrevWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(newDate);
    };

    // Check if a booking matches a slot
    const getBookingForSlot = (date: string, startTime: string) => {
        return bookings.find(b => {
            const bookingStart = b.startDatetime;
            const slotStart = `${date}T${startTime}:00`;

            // Check time match
            if (bookingStart !== slotStart) return false;

            // Filter by building down here
            if (selectedBuildingId !== 'ALL') {
                if (b.resource?.building?.building_name !== buildings.find(bldg => bldg.building_id === selectedBuildingId)?.building_name) {
                    return false;
                }
            }
            return true;
        });
    };

    const getWeekDays = () => {
        const days = [];
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];

        // Clone to avoid mutating state directly in loop
        const start = new Date(currentWeekStart);

        for (let i = 0; i < 5; i++) {
            const next = new Date(start);
            next.setDate(start.getDate() + i);

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

    // Format range for display
    const weekRange = `${weekDays[0].dayNum} ${weekDays[0].fullName.slice(0, 3)} - ${weekDays[4].dayNum} ${weekDays[4].fullName.slice(0, 3)}`;

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
            card: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
            badge: 'bg-emerald-100 text-emerald-700',
        },
        PENDING: {
            card: 'bg-amber-50 border-amber-200 hover:border-amber-300',
            badge: 'bg-amber-100 text-amber-700',
        },
        REJECTED: {
            card: 'bg-rose-50 border-rose-200 hover:border-rose-300',
            badge: 'bg-rose-100 text-rose-700',
        },
    };

    // Skeleton loader for timetable
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-none border border-slate-200 overflow-hidden animate-pulse">
                {/* Skeleton Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <div className="h-6 w-32 bg-slate-200 rounded"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-8 bg-slate-200 rounded"></div>
                        <div className="h-8 w-8 bg-slate-200 rounded"></div>
                    </div>
                </div>
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
            <div className="bg-white dark:bg-[#161b22] rounded-lg shadow-none border border-slate-200 dark:border-[#30363d] overflow-hidden flex flex-col h-full">

                {/* Navigation Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#161b22]">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Calendar size={20} className="text-indigo-600" />
                            <span>{weekRange}</span>
                            {/* Show year if needed, or keeping it simple */}
                            <span className="text-sm font-normal text-slate-400">
                                {currentWeekStart.getFullYear()}
                            </span>
                        </h2>

                        <div className="h-6 w-px bg-slate-200 mx-2"></div>

                        {/* Building Filter Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-500">Building:</span>
                            <select
                                value={selectedBuildingId}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedBuildingId(val === 'ALL' ? 'ALL' : Number(val));
                                }}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none font-medium min-w-[160px]"
                            >
                                <option value="ALL">All Buildings</option>
                                {buildings.map(b => (
                                    <option key={b.building_id} value={b.building_id}>
                                        {b.building_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevWeek}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors border border-slate-200"
                            title="Previous Week"
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() => {
                                const curr = new Date();
                                const day = curr.getDay();
                                const daysUntilMonday = day === 0 ? 1 : (day === 6 ? 2 : 1 - day);
                                const nextMonday = new Date(curr);
                                nextMonday.setDate(curr.getDate() + daysUntilMonday);
                                setCurrentWeekStart(nextMonday);
                            }}
                            className="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={handleNextWeek}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors border border-slate-200"
                            title="Next Week"
                        >
                            Next →
                        </button>
                    </div>
                </div>

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
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${day.isToday ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 bg-transparent dark:border-[#30363d] border border-slate-200'}`}>
                                {day.dayNum}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Content */}
                <div className="divide-y divide-slate-100 dark:divide-[#21262d] bg-slate-50/30 dark:bg-transparent">
                    {timeline.map((row, idx) => {
                        const isBreak = row.type === 'break';

                        if (isBreak) {
                            return (
                                <div key={idx} className="relative py-2 bg-slate-100/50 flex justify-center items-center border-b border-slate-200/60">
                                    <div className="absolute left-0 inset-y-0 w-[80px] flex items-center justify-center">
                                        <div className="text-[10px] font-bold text-slate-400 dark:text-[#6e7681] bg-white dark:bg-transparent px-2 py-0.5 rounded-full border border-slate-200 dark:border-[#30363d]">
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
                                <div className="p-3 flex flex-col items-center justify-start pt-6 border-r border-slate-100 dark:border-[#21262d] bg-white dark:bg-transparent">
                                    <span className="text-sm font-bold text-slate-700 font-mono">{row.start}</span>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-[#30363d] my-2"></div>
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
                                                <div className="w-full h-full rounded-md border border-dashed border-slate-200 dark:border-[#30363d] bg-slate-50/50 dark:bg-transparent flex flex-col items-center justify-center gap-1 opacity-50">
                                                    <Clock size={16} className="text-slate-300" />
                                                    <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Past</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleSlotClick(dayIdx, row)}
                                                    className="w-full h-full rounded-md border border-slate-200 dark:border-[#30363d] bg-white dark:bg-transparent dark:hover:border-indigo-500 hover:border-indigo-400 transition-all duration-200 group/slot flex flex-col items-center justify-center gap-2"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1c2333] group-hover/slot:bg-indigo-50 dark:group-hover/slot:bg-indigo-900/30 text-slate-300 group-hover/slot:text-indigo-600 flex items-center justify-center transition-colors">
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
                selectedBuildingId={selectedBuildingId === 'ALL' ? undefined : selectedBuildingId}
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
