"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogOut, Monitor, Moon, Sun, Globe, Bell, Shield, Key } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const handleSignOut = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            {/* Sidebar (Fixed width) */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64 min-w-0">
                <div className="max-w-4xl mx-auto p-8 pt-10">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
                        <p className="text-slate-500 mt-2">Manage your account preferences, appearance, and security.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Appearance Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Monitor size={20} className="text-indigo-600" />
                                Appearance
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <Sun size={24} className={theme === 'light' ? 'text-indigo-600' : 'text-slate-400'} />
                                            <span className={`mt-2 text-sm font-medium ${theme === 'light' ? 'text-indigo-700' : 'text-slate-600'}`}>Light</span>
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <Moon size={24} className={theme === 'dark' ? 'text-indigo-600' : 'text-slate-400'} />
                                            <span className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-indigo-700' : 'text-slate-600'}`}>Dark</span>
                                        </button>
                                        <button
                                            onClick={() => setTheme('system')}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <Monitor size={24} className={theme === 'system' ? 'text-indigo-600' : 'text-slate-400'} />
                                            <span className={`mt-2 text-sm font-medium ${theme === 'system' ? 'text-indigo-700' : 'text-slate-600'}`}>System</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferences Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Globe size={20} className="text-indigo-600" />
                                Preferences
                            </h2>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-800">Language</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Select your preferred language for the interface.</p>
                                    </div>
                                    <select className="bg-slate-50 text-slate-700 text-sm rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div className="h-px bg-slate-100 w-full"></div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                                            <Bell size={14} className="text-slate-400" />
                                            Email Notifications
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Receive an email when your resource booking is approved.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Shield size={20} className="text-indigo-600" />
                                Security
                            </h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                                        <Key size={14} className="text-slate-400" />
                                        Change Password
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Update your password to keep your account secure.</p>
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard/profile')}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Go to Profile
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone (Sign Out) */}
                        <div className="bg-white rounded-2xl border border-red-200 p-6">
                            <h2 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
                                <LogOut size={20} />
                                Account Actions
                            </h2>
                            <p className="text-sm text-slate-500 mb-4">
                                Signing out will end your current session. You will need to log back in to access your dashboard.
                            </p>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>

                    </div>
                    {/* Bottom Padding */}
                    <div className="h-12"></div>
                </div>
            </main>
        </div>
    );
}
