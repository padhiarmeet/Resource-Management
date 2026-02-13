"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ArrowRight, Wrench } from "lucide-react";

export interface MaintenanceIssue {
    id: number;
    type: string;
    notes: string;
    status: string;
    scheduledDate: string;
    resourceName: string;
}

interface MaintenanceWidgetProps {
    issues: MaintenanceIssue[];
    loading?: boolean;
}

const SkeletonItem = () => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-pulse">
        <div className="w-4 h-4 bg-slate-200 rounded-full mt-0.5 shrink-0"></div>
        <div className="flex-1">
            <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 w-48 bg-slate-100 rounded"></div>
        </div>
    </div>
);

export const MaintenanceWidget: React.FC<MaintenanceWidgetProps> = ({ issues = [], loading }) => {
    const openIssues = issues.filter(i => i.status !== "COMPLETED");

    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-5 w-28 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-slate-100 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3">
                    <SkeletonItem />
                    <SkeletonItem />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-800">Maintenance</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${openIssues.length > 0 ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'}`}>
                    {openIssues.length > 0 ? `${openIssues.length} Open` : 'All Clear'}
                </span>
            </div>

            <div className="space-y-3">
                {issues.length === 0 && (
                    <div className="text-center py-4 text-slate-400 text-sm">No maintenance records.</div>
                )}
                {issues.map((issue) => (
                    <div key={issue.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        {issue.status === "COMPLETED" ? (
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                        ) : (
                            <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        )}
                        <div>
                            <div className="text-sm font-semibold text-slate-800">{issue.type}</div>
                            <div className="text-xs text-slate-500">
                                {issue.resourceName} • {issue.scheduledDate}
                                {issue.notes && ` • ${issue.notes}`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Link href="/dashboard/maintenance" className="w-full mt-4 text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors">
                View All Reports <ArrowRight size={12} />
            </Link>
        </div>
    );
};
