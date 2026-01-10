'use client';

import React, { useState } from 'react';
import { Send, User } from 'lucide-react';

interface SidebarProps {
    onUpdateProfile: (persona: string) => void;
}

export default function Sidebar({ onUpdateProfile }: SidebarProps) {
    const [persona, setPersona] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(persona);
    };

    return (
        <div className="w-full md:w-80 h-auto md:h-full bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm z-10 relative">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <User className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 font-sans">Travel Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-2">
                    <label htmlFor="persona" className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Your Persona
                    </label>
                    <textarea
                        id="persona"
                        className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-700 bg-gray-50 transition-all"
                        placeholder="e.g., I love Indian veg food and coins..."
                        value={persona}
                        onChange={(e) => setPersona(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="mt-2 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    <Send className="w-4 h-4" />
                    Update Profile
                </button>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h3 className="text-sm font-bold text-blue-800 mb-2">Try these:</h3>
                    <ul className="text-sm text-blue-600 space-y-1 list-disc list-inside">
                        <li>"I love Indian food"</li>
                        <li>"Interested in Coins"</li>
                        <li>"Vegetarian foodie"</li>
                    </ul>
                </div>
            </form>

            <div className="mt-auto text-xs text-gray-400 text-center">
                Powered by AI Mock-Filtering
            </div>
        </div>
    );
}
