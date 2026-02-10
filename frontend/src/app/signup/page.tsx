"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Building, User, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/dashboard");
        setIsLoading(false);
    };

    return (
        <main className="h-screen flex items-center justify-center p-4 font-sans text-slate-900 overflow-hidden">
            {/* Main Container */}
            <div className="w-full max-w-[1100px] h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200">

                {/* LEFT SIDE: Visuals (Mirrored) */}
                <div className="hidden lg:flex w-[40%] bg-[#1A1F2C] relative items-center justify-center overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 p-10 max-w-md text-center text-white">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 border border-white/10 backdrop-blur-md">
                            <Building className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Join the Network</h2>
                        <p className="text-slate-300 text-sm leading-relaxed font-light">
                            Create your institutional account to access library resources, book labs, and manage your academic schedule.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                <div className="text-xl font-bold mb-0.5">20+</div>
                                <div className="text-[10px] text-slate-400">Departments</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                <div className="text-xl font-bold mb-0.5">5k+</div>
                                <div className="text-[10px] text-slate-400">Active Users</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Form Area */}
                <div className="w-full lg:w-[60%] p-8 lg:p-12 flex flex-col justify-center relative z-10 h-full overflow-y-auto">

                    <div className="mb-6 text-center lg:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                            <Image src="/app_logo.png" alt="OpenSlot Logo" width={36} height={36} />
                            <span className="text-base font-bold tracking-tight text-slate-900">OpenSlot</span>
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
                            Create Account
                        </h1>
                        <p className="text-sm text-slate-500">
                            Enter your details to register as a new user.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700 ml-1">First Name</label>
                                <Input
                                    type="text"
                                    placeholder="John"
                                    required
                                    className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700 ml-1">Last Name</label>
                                <Input type="text" placeholder="Doe" required className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white text-sm" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 ml-1">Email Address</label>
                            <Input
                                type="email"
                                placeholder="name@university.edu"
                                icon={<Mail className="w-4 h-4" />}
                                required
                                className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 ml-1">Phone Number</label>
                            <Input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                icon={<Smartphone className="w-4 h-4" />}
                                className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 ml-1">Password</label>
                            <Input
                                type="password"
                                placeholder="Create a strong password"
                                icon={<Lock className="w-4 h-4" />}
                                required
                                className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white text-sm"
                            />
                            <p className="text-[10px] text-slate-400 ml-1">
                                Must be at least 8 characters with 1 special character
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all mt-2"
                            isLoading={isLoading}
                        >
                            Get Started <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}
