import React from "react";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export const MaintenanceWidget: React.FC = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-800">Maintenance</h3>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">2 Open</span>
            </div>

            <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                        <div className="text-sm font-semibold text-slate-800">Projector Malfunction</div>
                        <div className="text-xs text-slate-500">Hall A - Reported 2h ago</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                        <div className="text-sm font-semibold text-slate-800">AC Leakage</div>
                        <div className="text-xs text-slate-500">Lab 2 - Reported 5h ago</div>
                    </div>
                </div>
            </div>

            <button className="w-full mt-4 text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors">
                View All Reports <ArrowRight size={12} />
            </button>
        </div>
    );
};
