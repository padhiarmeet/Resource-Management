import React from "react";
import { Clock, MapPin, MoreHorizontal } from "lucide-react";

interface TimelineEvent {
    id: string;
    time: string;
    title: string;
    location: string;
    status: "live" | "upcoming" | "completed";
}

export const BookingTimeline: React.FC = () => {
    const events: TimelineEvent[] = [
        {
            id: "1",
            time: "10:30 - 11:30 AM",
            title: "Advanced Data Structures",
            location: "Hall B-402",
            status: "live",
        },
        {
            id: "2",
            time: "01:00 - 02:00 PM",
            title: "Faculty Meeting",
            location: "Conf. Room A",
            status: "upcoming",
        },
        {
            id: "3",
            time: "03:30 - 05:00 PM",
            title: "Physics Lab Review",
            location: "Lab Complex 3",
            status: "upcoming",
        },
    ];

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
