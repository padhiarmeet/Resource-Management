"use client";

import React from "react";
import { Clock, MapPin, MoreHorizontal } from "lucide-react";

export interface TimelineEvent {
    id: string;
    time: string;
    title: string;
    location: string;
    status: "live" | "upcoming" | "completed";
}

interface BookingTimelineProps {
    events: TimelineEvent[];
    loading?: boolean;
}

const SkeletonRow = () => (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div>
                <div className="h-4 w-40 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 w-56 bg-slate-100 rounded"></div>
            </div>
        </div>
        <div className="w-4 h-4 bg-slate-200 rounded"></div>
    </div>
);

export const BookingTimeline: React.FC<BookingTimelineProps> = ({ events = [], loading }) => {
    if (loading) {
        return (
            <div className="space-y-3">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400 text-sm">
                No scheduled bookings found.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {events.map((event) => (
                <div
                    key={event.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${event.status === "live"
                        ? "bg-indigo-50 border-indigo-100"
                        : "bg-white border-slate-100 hover:border-slate-200"
                        } transition-colors`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${event.status === "live" ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <div>
                            <h4 className={`text-sm font-semibold ${event.status === 'live' ? 'text-indigo-900' : 'text-slate-800'}`}>
                                {event.title}
                                {event.status === "live" && <span className="ml-2 text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold">LIVE</span>}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                                <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                            </div>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};
