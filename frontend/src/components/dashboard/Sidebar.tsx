"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Box,
    Settings,
    LogOut,
    User,
    HelpCircle,
    Bell,
    Wrench,
    ClipboardList,
    BookOpen,
    Monitor,
    AlertTriangle,
    Users,
    Map,
} from "lucide-react";

interface UserData {
    userId: number;
    name: string;
    email: string;
    role: string;
}

// Role-based menu configuration
const menuConfig: Record<string, { label: string; icon: React.ElementType; href: string }[]> = {
    ADMIN: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Schedule", icon: Calendar, href: "/dashboard/faculty/booking" },
        { label: "Resource Bank", icon: Box, href: "/dashboard/resource-bank" },
        { label: "Campus Map", icon: Map, href: "/dashboard/map" },
        { label: "Maintenance", icon: Wrench, href: "/dashboard/maintenance" },
        { label: "Manage Users", icon: Users, href: "/dashboard/admin/users" },
    ],
    FACULTY: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/faculty" },
        { label: "My Schedule", icon: Calendar, href: "/dashboard/faculty/booking" },
        { label: "Resource Bank", icon: Box, href: "/dashboard/resource-bank" },
        { label: "Campus Map", icon: Map, href: "/dashboard/map" },
        { label: "Report Issue", icon: AlertTriangle, href: "/dashboard/maintenance" },
    ],
    STUDENT: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/student" },
        { label: "My Timetable", icon: BookOpen, href: "#" },
        { label: "Resource Availability", icon: Monitor, href: "/dashboard/resource-bank" },
        { label: "Campus Map", icon: Map, href: "/dashboard/map" },
    ],
    MAINTENANCE: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/maintenance" },
        { label: "My Tasks", icon: ClipboardList, href: "/dashboard/maintenance" },
        { label: "Resource Bank", icon: Box, href: "/dashboard/resource-bank" },
    ],
};

export const Sidebar: React.FC<{ className?: string }> = ({ className = "" }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    const role = user?.role?.toUpperCase() || "ADMIN";
    const items = menuConfig[role] || menuConfig.ADMIN;

    const handleSignOut = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <div className={`h-screen w-64 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50 ${className}`}>
            {/* Logo Area */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
                <Image src="/app_logo.png" alt="OpenSlot Logo" width={40} height={40} />
                <span className="font-bold text-lg text-slate-800 tracking-tight">OpenSlot</span>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Menu</div>

                {items.map((item) => (
                    <NavItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        href={item.href}
                        active={pathname === item.href}
                    />
                ))}

                <div className="my-4 h-px bg-slate-100 mx-3"></div>

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Account</div>
                <NavItem icon={User} label="Profile" href="#" active={false} />
                <NavItem icon={Bell} label="Notifications" badge="3" href="#" active={false} />
                <NavItem icon={Settings} label="Settings" href="#" active={false} />
            </nav>

            {/* User Info & Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                {user && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-800 truncate">{user.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium uppercase">{user.role}</div>
                        </div>
                    </div>
                )}
                <NavItem icon={HelpCircle} label="Help Center" href="#" active={false} />
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1 font-medium"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    href?: string;
    active?: boolean;
    badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href = "#", active, badge }) => {
    const content = (
        <div
            className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 group ${active
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className={active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-600"} />
                <span className="font-medium">{label}</span>
            </div>
            {badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {badge}
                </span>
            )}
        </div>
    );

    return (
        <Link href={href} className="block w-full">
            {content}
        </Link>
    );
};
