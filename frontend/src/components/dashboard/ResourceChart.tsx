"use client";

import React from "react";

export interface ResourceChartData {
    totalResources: number;
    bookedResources: number;
    classrooms: number;
    labs: number;
    auditoriums: number;
    meetingRooms: number;
}

interface ResourceChartProps {
    data: ResourceChartData;
    loading?: boolean;
}

export const ResourceChart: React.FC<ResourceChartProps> = ({ data, loading }) => {
    const bookedPercent = data.totalResources > 0
        ? Math.round((data.bookedResources / data.totalResources) * 100)
        : 0;

    // Calculate SVG donut segments
    const circumference = 2 * Math.PI * 40; // r=40
    const classroomDash = data.totalResources > 0 ? (data.classrooms / data.totalResources) * circumference : 0;
    const labDash = data.totalResources > 0 ? (data.labs / data.totalResources) * circumference : 0;
    const auditDash = data.totalResources > 0 ? (data.auditoriums / data.totalResources) * circumference : 0;
    const meetingDash = data.totalResources > 0 ? (data.meetingRooms / data.totalResources) * circumference : 0;

    if (loading) {
        return (
            <div className="h-full flex flex-col animate-pulse">
                <div className="h-5 w-40 bg-slate-200 rounded mb-6"></div>
                <div className="flex justify-center items-center flex-1">
                    <div className="w-40 h-40 rounded-full bg-slate-100 border-[12px] border-slate-200"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-10 bg-slate-100 rounded"></div>
                    <div className="h-10 bg-slate-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-base font-bold text-slate-800 mb-6">Resource Allocation</h3>

            <div className="flex justify-center items-center flex-1">
                {/* CSS Donut Chart */}
                <div className="relative w-40 h-40 rounded-full border-[10px] border-slate-50 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Classroom segment (indigo) */}
                        <circle cx="50" cy="50" r="40" stroke="#4f46e5" strokeWidth="8" fill="none"
                            strokeDasharray={`${classroomDash} ${circumference}`} />
                        {/* Lab segment (violet) */}
                        <circle cx="50" cy="50" r="40" stroke="#8b5cf6" strokeWidth="8" fill="none"
                            strokeDasharray={`${labDash} ${circumference}`}
                            strokeDashoffset={`${-classroomDash}`} />
                        {/* Auditorium segment (pink) */}
                        <circle cx="50" cy="50" r="40" stroke="#ec4899" strokeWidth="8" fill="none"
                            strokeDasharray={`${auditDash} ${circumference}`}
                            strokeDashoffset={`${-(classroomDash + labDash)}`} />
                        {/* Meeting Room segment (blue) */}
                        <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="8" fill="none"
                            strokeDasharray={`${meetingDash} ${circumference}`}
                            strokeDashoffset={`${-(classroomDash + labDash + auditDash)}`} />
                    </svg>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">{data.totalResources}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Total</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                        <span className="text-xs text-slate-500">Classrooms</span>
                    </div>
                    <span className="font-bold text-slate-800">{data.classrooms}</span>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                        <span className="text-xs text-slate-500">Labs</span>
                    </div>
                    <span className="font-bold text-slate-800">{data.labs}</span>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <span className="text-xs text-slate-500">Auditoriums</span>
                    </div>
                    <span className="font-bold text-slate-800">{data.auditoriums}</span>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-slate-500">Meeting Rooms</span>
                    </div>
                    <span className="font-bold text-slate-800">{data.meetingRooms}</span>
                </div>
            </div>
        </div>
    );
};
