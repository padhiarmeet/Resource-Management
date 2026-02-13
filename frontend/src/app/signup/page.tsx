"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, User, GraduationCap, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { registerUser } from "@/lib/api";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEmail(val);
        setEmailError("");
        setError("");

        // Auto-detect role from email domain
        if (val.includes("@")) {
            const domain = val.split("@")[1]?.toLowerCase();
            if (domain === "student.com") setSelectedRole("STUDENT");
            else if (domain === "faculty.com") setSelectedRole("FACULTY");
            else if (domain === "maintenance.com") setSelectedRole("MAINTENANCE");
            else if (domain === "admin.com") setSelectedRole("ADMIN");
            else {
                setSelectedRole("");
            }
        } else {
            setSelectedRole("");
        }
    };

    const validateEmail = () => {
        if (!email) return;
        if (!selectedRole) {
            setEmailError("Please use a valid institutional email (@student.com, @faculty.com, etc.)");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) {
            setEmailError("Invalid email domain. Cannot determine role.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const fullName = `${firstName} ${lastName}`.trim();
            const user = await registerUser(fullName, email, password, selectedRole);

            // Store user info in localStorage
            localStorage.setItem("user", JSON.stringify({
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
            }));

            // Redirect based on role
            const role = user.role?.toUpperCase();
            if (role === "STUDENT") router.push("/dashboard/student");
            else if (role === "FACULTY") router.push("/dashboard/faculty");
            else if (role === "MAINTENANCE") router.push("/dashboard/maintenance");
            else router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="h-screen flex items-center justify-center p-4 font-sans text-slate-900 overflow-hidden">
            <div className="w-full max-w-[1100px] h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200">

                {/* LEFT SIDE: Visuals */}
                <div className="hidden lg:flex w-[40%] bg-slate-900 relative flex-col items-center justify-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    <div className="absolute -top-[20%] -left-[10%] w-[70vh] h-[70vh] rounded-full bg-gradient-to-br from-indigo-900/40 to-slate-900/0 blur-3xl"></div>
                    <div className="absolute top-[40%] -right-[20%] w-[60vh] h-[60vh] rounded-full bg-gradient-to-bl from-blue-900/30 to-slate-900/0 blur-3xl"></div>
                    <div className="absolute -bottom-[10%] left-[20%] w-[50vh] h-[50vh] rounded-full bg-gradient-to-t from-slate-800/50 to-slate-900/0 blur-3xl"></div>

                    <div className="relative z-10 p-10 max-w-md text-center text-white flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-indigo-500/30 rounded-b-[40%] rounded-t-lg"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] border border-indigo-500/20 rounded-b-[45%] rounded-t-xl"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] h-[220%] border border-indigo-500/10 rounded-b-[50%] rounded-t-2xl"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260%] h-[260%] border border-indigo-500/5 rounded-b-[55%] rounded-t-3xl"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] border border-indigo-500/5 rounded-b-[60%] rounded-t-[3rem]"></div>

                            <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                                <Image src="/app_logo.png" alt="OpenSlot Logo" width={100} height={100} className="drop-shadow-2xl" />
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold mb-2 tracking-tight text-white drop-shadow-md">OpenSlot</h1>
                        <h2 className="text-xl font-medium mb-4 text-slate-300">Join the Network</h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-light mb-8 max-w-xs mx-auto">
                            Your gateway to institutional resources. Book labs, access libraries, and manage your schedule effortlessly.
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full px-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <div className="text-2xl font-bold mb-1 text-slate-100">20+</div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Departments</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <div className="text-2xl font-bold mb-1 text-slate-100">5k+</div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Users</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Form Area */}
                <div className="w-full lg:w-[60%] p-8 lg:p-16 flex flex-col justify-center relative z-10 h-full overflow-y-auto">

                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                            Create Account
                        </h1>
                        <p className="text-sm text-slate-500">
                            Enter your details to register as a new user.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700 ml-1">First Name</label>
                                <Input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    required
                                    className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700 ml-1">Last Name</label>
                                <Input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    required
                                    className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 ml-1">Email Address</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={validateEmail}
                                placeholder="name@domain.com"
                                icon={<Mail className="w-4 h-4" />}
                                required
                                className={`h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white text-sm ${emailError ? "border-red-300 ring-2 ring-red-100" : ""}`}
                            />
                            {emailError ? (
                                <p className="text-[10px] text-red-500 ml-1 mt-1 font-medium">{emailError}</p>
                            ) : (
                                <p className="text-[10px] text-slate-400 ml-1 mt-1">
                                    Use institutional email (@student.com, @faculty.com, @maintenance.com)
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5 opacity-90">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-semibold text-slate-700 ml-1">Detected Role</label>
                                {selectedRole && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{selectedRole}</span>}
                            </div>
                            <div className="grid grid-cols-3 gap-2 pointer-events-none select-none grayscale-[0.2]">
                                {[
                                    { value: "STUDENT", label: "Student", icon: <GraduationCap className="w-4 h-4" /> },
                                    { value: "FACULTY", label: "Faculty", icon: <User className="w-4 h-4" /> },
                                    { value: "MAINTENANCE", label: "Maintenance", icon: <Wrench className="w-4 h-4" /> },
                                ].map((role) => (
                                    <div
                                        key={role.value}
                                        className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg border text-xs font-medium transition-all ${selectedRole === role.value
                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-200 scale-[1.02]"
                                            : "border-slate-200 bg-slate-50 text-slate-400"
                                            }`}
                                    >
                                        {role.icon}
                                        {role.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 ml-1">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            className="w-full h-11 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            isLoading={isLoading}
                            disabled={!selectedRole || !!emailError}
                        >
                            Create Account <ArrowRight className="ml-2 w-4 h-4" />
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
