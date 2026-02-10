"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function LoginPage() {
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
        <main className="min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans text-slate-900">
            {/* Main Container */}
            <div className="w-full max-w-[1200px] min-h-[80vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200">

                {/* LEFT SIDE: Form Area */}
                <div className="w-full lg:w-[45%] p-12 lg:p-16 flex flex-col justify-center relative z-10">

                    <div className="mb-10">
                        <Link href="/" className="flex items-center gap-2 mb-8 group">
                            <Image src="/app_logo.png" alt="OpenSlot Logo" width={40} height={40} />
                            <span className="text-lg font-bold tracking-tight text-slate-900">OpenSlot</span>
                        </Link>

                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-slate-500">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
                            <Input
                                type="email"
                                placeholder="professor@university.edu"
                                icon={<Mail className="w-4 h-4" />}
                                required
                                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-semibold text-slate-700">Password</label>
                                <Link
                                    href="#"
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="w-4 h-4" />}
                                required
                                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full text-base font-semibold bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-[0.98] transition-all mt-4"
                            isLoading={isLoading}
                        >
                            Sign in to Portal <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-slate-500">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Create separate account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: Visuals */}
                <div className="hidden lg:flex w-[55%] bg-slate-50 relative items-center justify-center overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-100/60 rounded-full blur-3xl"></div>

                    {/* Abstract 3D-like Shape or Card Mockup */}
                    <div className="relative z-10 p-12 max-w-md text-center">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-indigo-500/10 flex items-center justify-center mx-auto mb-8 border border-white/50 backdrop-blur-sm">
                            <User className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Faculty Access</h2>
                        <p className="text-slate-500 leading-relaxed">
                            "Secure credentials effectively manage access to sensitive academic resources and student data records."
                        </p>

                        {/* Decorative Dots */}
                        <div className="flex gap-2 justify-center mt-8">
                            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        </div>
                    </div>

                    {/* Grid Texture Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                </div>

            </div>
        </main>
    );
}
