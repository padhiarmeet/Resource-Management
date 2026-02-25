"use client";

import React, { useState, useEffect } from 'react';
import { X, Building as BuildingIcon, Layers, ChevronRight, CheckCircle2, CalendarClock, MapPin, ArrowRight } from 'lucide-react';
import { fetchBuildings, fetchResourceTypes, submitBooking } from '@/lib/api';
import { fetchResources } from '@/lib/api';

interface Building {
    building_id: number;
    building_name: string;
    building_number: string;
    total_floors: number;
}

interface ResourceType {
    resource_type_id: number;
    type_name: string;
}

interface Resource {
    resource_id: number;
    resource_name: string;
    building?: { building_id: number };
    resourceType?: { resource_type_id: number };
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    slot: {
        date: string;
        startTime: string;
        endTime: string;
        dayName: string;
    } | null;
    selectedBuildingId?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, slot, selectedBuildingId }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadData();
            // We set step to 1 initially, but if buildings are loaded we might jump to 2
            setStep(1);
            setSelectedBuilding(null);
            setCompleted(false);
        }
    }, [isOpen]);

    // Handle pre-selected building once data is loaded
    useEffect(() => {
        if (buildings.length > 0 && selectedBuildingId) {
            const b = buildings.find(bldg => bldg.building_id === selectedBuildingId);
            if (b) {
                setSelectedBuilding(b);
                setStep(2);
            }
        }
    }, [buildings, selectedBuildingId, isOpen]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [bData, rData, resData] = await Promise.all([
                fetchBuildings(),
                fetchResourceTypes(),
                fetchResources(),
            ]);
            setBuildings(bData);
            setResourceTypes(rData);
            setResources(resData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuildingSelect = (building: Building) => {
        setSelectedBuilding(building);
        setStep(2);
    };

    const handleResourceTypeSelect = async (resourceType: ResourceType) => {
        if (!slot || !selectedBuilding) return;

        // Find a resource matching this building + resource type
        const matchingResource = resources.find(r =>
            r.building?.building_id === selectedBuilding.building_id &&
            r.resourceType?.resource_type_id === resourceType.resource_type_id
        );

        if (!matchingResource) {
            alert(`No ${resourceType.type_name} found in ${selectedBuilding.building_name}. Please select a different combination.`);
            return;
        }

        setSubmitting(true);
        const startDatetime = `${slot.date}T${slot.startTime}:00`;
        const endDatetime = `${slot.date}T${slot.endTime}:00`;

        let currentUserId = 1; // Default fallback
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const user = JSON.parse(stored);
                currentUserId = user.userId;
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
        }

        try {
            await submitBooking({
                user_id: currentUserId,
                resource_id: matchingResource.resource_id,
                start_datetime: startDatetime,
                end_datetime: endDatetime,
            });
            setCompleted(true);
            setTimeout(() => {
                onClose();
            }, 2500);
        } catch (error: any) {
            console.error("Booking failed", error);
            alert(error?.message || "Failed to submit booking request");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !slot) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white relative">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {completed ? "Booking Confirmed" : "Request Booking"}
                        </h2>
                        {!completed && (
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                                    <CalendarClock size={14} />
                                    <span>{slot.dayName}, {slot.startTime} - {slot.endTime}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>

                    {/* Step Progress Bar */}
                    {!completed && !loading && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                            <div
                                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                                style={{ width: step === 1 ? '50%' : '100%' }}
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    {completed ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in zoom-in-50 duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-green-100/50">
                                <CheckCircle2 size={40} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Request Submitted!</h3>
                                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                                    Your booking request for <span className="font-bold text-slate-900">{selectedBuilding?.building_name}</span> has been successfully sent to the admin for approval.
                                </p>
                            </div>
                        </div>
                    ) : (
                        loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                                <p className="text-slate-400 font-medium">Loading availability...</p>
                            </div>
                        ) : (
                            step === 1 ? (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-800">Select Building</h3>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 1 of 2</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {buildings.map((building) => (
                                            <button
                                                key={building.building_id}
                                                onClick={() => handleBuildingSelect(building)}
                                                className="group relative flex flex-col items-start p-5 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 transition-all duration-200 text-left"
                                            >
                                                <div className="absolute top-5 right-5 text-slate-300 group-hover:text-indigo-500 transition-colors">
                                                    <ArrowRight size={20} className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </div>

                                                <div className="p-3 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <BuildingIcon size={24} />
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">{building.building_name}</h4>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-auto">
                                                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-xs">{building.building_number}</span>
                                                    <span>•</span>
                                                    <span>{building.total_floors} Floors</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-6 bg-white p-2 rounded-lg border border-slate-100 w-fit shadow-sm">
                                        <button
                                            onClick={() => {
                                                if (!selectedBuildingId) {
                                                    setStep(1);
                                                }
                                            }}
                                            disabled={!!selectedBuildingId}
                                            className={`font-medium px-2 ${selectedBuildingId ? 'text-slate-400 cursor-not-allowed' : 'text-slate-600 hover:text-indigo-600 hover:underline'}`}
                                        >
                                            Select Building
                                        </button>
                                        <ChevronRight size={14} className="text-slate-300" />
                                        <div className="flex items-center gap-2 pl-1 pr-3 text-indigo-600 font-bold">
                                            <MapPin size={14} />
                                            <span>{selectedBuilding?.building_name}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-800">Select Resource Type</h3>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 2 of 2</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {resourceTypes.map((type) => (
                                            <button
                                                key={type.resource_type_id}
                                                onClick={() => handleResourceTypeSelect(type)}
                                                disabled={submitting}
                                                className="group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-lg hover:border-fuchsia-500 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <div className="p-3 bg-gradient-to-br from-fuchsia-50 to-pink-50 text-fuchsia-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                    <Layers size={22} />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-bold text-slate-800 text-lg group-hover:text-fuchsia-700 transition-colors">{type.type_name}</span>
                                                    <p className="text-xs text-slate-400 mt-1">Click to confirm booking</p>
                                                </div>
                                                {submitting ? (
                                                    <div className="animate-spin h-5 w-5 border-2 border-fuchsia-600 border-t-transparent rounded-full"></div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-fuchsia-100 group-hover:text-fuchsia-600 transition-all">
                                                        <ArrowRight size={16} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
