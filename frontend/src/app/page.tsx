"use client";

import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    CalendarClock,
    HardDrive,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Users,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 is-map-page">

            {/* ─── Navbar ─── */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/app_logo.png" alt="OpenSlot Logo" width={37} height={37} />
                        <span className="text-lg font-bold tracking-tight text-slate-900">OpenSlot</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                            Log in
                        </Link>
                        <Link href="/signup">
                            <Button className="rounded-full px-5 py-2 h-auto text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 hover:shadow-xl transition-all hover:-translate-y-0.5">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── Global Background Ripple ─── */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-40">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-indigo-500/30 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-indigo-500/20 rounded-full animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-indigo-500/10 rounded-full animate-pulse delay-1000"></div>
                </div>
            </div>

            {/* ─── Hero Section ─── */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden relative z-10">

                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-indigo-100/40 to-violet-100/40 rounded-[100%] blur-3xl -z-10 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">v2.0 Now Available</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Campus management, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient bg-300%">
                            reimagined.
                        </span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        The all-in-one platform for faculties and students. Streamline bookings, manage resources, and track acadmic schedules in one beautiful dashboard.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto px-8 py-6 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5">
                                Launch Dashboard
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/#features" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all hover:-translate-y-0.5">
                                View Features
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Bento Grid Features ─── */}
            <section id="features" className="py-20 lg:py-32 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to run your department</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Powerful tools designed for the modern educational ecosystem.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <CalendarClock className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Scheduling</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Book lecture halls, labs, and meeting rooms instantly. Conflict detection ensures zero overlap.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-100 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <HardDrive className="w-6 h-6 text-violet-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Resource Management</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Track every asset from projectors to lab equipment. Digital cupboards keep inventory organized.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-fuchsia-100 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-fuchsia-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6 text-fuchsia-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Role-Based Access</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Granular permissions for Admins, Faculties, and Students. Secure and tailored experiences.
                            </p>
                        </div>

                        {/* Feature 4 (Spans 2 cols on desktop) */}
                        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-10 border border-slate-700 shadow-lg text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/30 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-6 backdrop-blur-sm">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">Real-time</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Live Dashboard Analytics</h3>
                                <p className="text-slate-300 max-w-lg mb-8 text-lg">
                                    Get instant insights into resource utilization, active sessions, and pending approvals. Decisions made data-driven.
                                </p>

                                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1">99%</div>
                                        <div className="text-sm text-slate-400">Uptime</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1">24/7</div>
                                        <div className="text-sm text-slate-400">Access</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1">500+</div>
                                        <div className="text-sm text-slate-400">Resources</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 flex flex-col justify-center items-center text-center">
                            <h3 className="text-xl font-bold text-indigo-900 mb-2">Ready to modernize?</h3>
                            <p className="text-indigo-600/80 mb-6 text-sm">Join hundreds of faculties today.</p>
                            <Link href="/signup">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl py-6">
                                    Create Free Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="bg-white border-t border-slate-200 py-12 px-6 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Image src="/app_logo.png" alt="OpenSlot Logo" width={24} height={24} className="rounded-md shadow-sm" />
                        <span className="font-semibold text-slate-700">OpenSlot</span>
                    </div>

                    <div className="flex gap-8 text-sm text-slate-500">
                        <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
                    </div>

                    <div className="text-sm text-slate-400">
                        © 2026 OpenSlot System. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
