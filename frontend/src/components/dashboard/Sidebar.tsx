import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    Calendar,
    Box,
    Settings,
    LogOut,
    User,
    HelpCircle,
    Bell,
    Layers,
} from "lucide-react";

export const Sidebar: React.FC = () => {
    return (
        <div className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
                <Image src="/app_logo.png" alt="OpenSlot Logo" width={40} height={40} />
                <span className="font-bold text-lg text-slate-800 tracking-tight">OpenSlot</span>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Menu</div>

                <NavItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active />
                <NavItem icon={Calendar} label="Schedule" href="/dashboard/faculty/booking" />
                <NavItem icon={Box} label="Resource Bank" href="#" />
                <NavItem icon={Layers} label="Departments" href="#" />

                <div className="my-4 h-px bg-slate-100 mx-3"></div>

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Account</div>
                <NavItem icon={User} label="Profile" href="#" />
                <NavItem icon={Bell} label="Notifications" badge="3" href="#" />
                <NavItem icon={Settings} label="Settings" href="#" />
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <NavItem icon={HelpCircle} label="Help Center" href="#" />
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1 font-medium">
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
