"use client";

import React from "react";
import {
    MapPin,
    Box,
    Monitor,
    User,
    Layers,
    ArrowRight
} from "lucide-react";

export interface Resource {
    resource_id: number;
    resource_name: string;
    resourceType: {
        resource_type_id: number;
        type_name: string;
    } | null;
    building: {
        building_id: number;
        building_name: string;
        building_number: string;
    } | null;
    floor_number: number;
    description: string;
}

interface ResourceCardProps {
    resource: Resource;
    onClick: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
    // Determine icon based on resource type
    const getIcon = (typeName: string = "") => {
        const lower = typeName.toLowerCase();
        if (lower.includes("lab")) return Monitor;
        if (lower.includes("meeting")) return User;
        if (lower.includes("class")) return Layers;
        return Box;
    };

    const TypeIcon = getIcon(resource.resourceType?.type_name);

    return (
        <div
            onClick={onClick}
            className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden"
        >
            {/* Hover Indicator */}
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200"></div>

            <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <TypeIcon size={24} />
                </div>
                <div className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                    {resource.resourceType?.type_name || "Unknown"}
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                {resource.resource_name}
            </h3>

            <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} className="text-slate-400" />
                    <span>
                        {resource.building?.building_name || "No Building"}, Floor {resource.floor_number}
                    </span>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">View Details</span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
};
