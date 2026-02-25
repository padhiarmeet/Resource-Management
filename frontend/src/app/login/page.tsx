"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const slides = [
        {
            id: 0,
            content: (
                <div className="relative flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-indigo-500/30 rounded-b-[40%] rounded-t-lg animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] border border-indigo-500/20 rounded-b-[45%] rounded-t-xl animate-pulse delay-75"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] h-[220%] border border-indigo-500/10 rounded-b-[50%] rounded-t-2xl animate-pulse delay-150"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260%] h-[260%] border border-indigo-500/5 rounded-b-[55%] rounded-t-3xl animate-pulse delay-300"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] border border-indigo-500/5 rounded-b-[60%] rounded-t-[3rem] animate-pulse delay-500"></div>

                        <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                            <Image src="/app_logo.png" alt="OpenSlot Logo" width={100} height={100} className="drop-shadow-2xl" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-2 tracking-tight text-white drop-shadow-md">OpenSlot</h1>
                    <p className="text-slate-400 text-sm font-light">Your gateway to institutional resources.</p>
                </div>
            )
        },
        {
            id: 1,
            content: (
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md max-w-sm text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Faculty Access</h2>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Securely manage course schedules, book labs, and access academic records with dedicated faculty privileges.
                    </p>
                </div>
            )
        },
        {
            id: 2,
            content: (
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md max-w-sm text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Secure & Reliable</h2>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Enterprise-grade security ensures your data is protected while providing seamless access across campus.
                    </p>
                </div>
            )
        }
    ];

    // Auto-play carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const user = await loginUser(email, password);

            // Store user info in localStorage
            localStorage.setItem("user", JSON.stringify({
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
            }));

            // Redirect based on role from backend response
            const role = user.role?.toUpperCase();
            if (role === "STUDENT") router.push("/dashboard/student");
            else if (role === "FACULTY") router.push("/dashboard/faculty");
            else if (role === "MAINTENANCE") router.push("/dashboard/maintenance");
            else router.push("/dashboard"); // Admin or default
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans text-slate-900 bg-slate-50 is-map-page">
            {/* Main Container */}
            <div className="w-full max-w-[1200px] min-h-[80vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200">

                {/* LEFT SIDE: Form Area */}
                <div className="w-full lg:w-[45%] p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-white">

                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-slate-500">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                {/* RIGHT SIDE: Carousel (Dark/Abstract Theme) */}
                <div className="hidden lg:flex w-[55%] bg-slate-900 relative flex-col items-center justify-center overflow-hidden">
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    <div className="absolute -top-[20%] -right-[10%] w-[70vh] h-[70vh] rounded-full bg-gradient-to-br from-indigo-900/40 to-slate-900/0 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[10%] -left-[10%] w-[50vh] h-[50vh] rounded-full bg-gradient-to-t from-blue-900/30 to-slate-900/0 blur-3xl animate-pulse delay-1000"></div>

                    {/* Carousel Content */}
                    <div className="relative z-10 w-full max-w-md h-[400px] flex items-center justify-center">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform ${index === currentSlide
                                    ? "opacity-100 translate-x-0 scale-100"
                                    : index < currentSlide
                                        ? "opacity-0 -translate-x-full scale-95"
                                        : "opacity-0 translate-x-full scale-95"
                                    }`}
                            >
                                {slide.content}
                            </div>
                        ))}
                    </div>

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-12 flex gap-3 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}
