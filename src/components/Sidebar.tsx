'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MapPin, Navigation2, Sliders } from 'lucide-react';

interface SidebarProps {
    onUpdateProfile: (persona: string) => void;
    onPlanRoute: (start: google.maps.places.PlaceResult | null, end: google.maps.places.PlaceResult | null) => void;
    onDetourDistanceChange: (distance: number) => void;
    routeInfo?: { distance: string; duration: string } | null;
}

export default function Sidebar({ onUpdateProfile, onPlanRoute, onDetourDistanceChange, routeInfo }: SidebarProps) {
    const [persona, setPersona] = useState('');
    const [detourDistance, setDetourDistance] = useState(1); // km
    const startInputRef = useRef<HTMLInputElement>(null);
    const endInputRef = useRef<HTMLInputElement>(null);
    const [startAutocomplete, setStartAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [endAutocomplete, setEndAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [startPlace, setStartPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [endPlace, setEndPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [startText, setStartText] = useState('');
    const [endText, setEndText] = useState('');

    useEffect(() => {
        // Initialize Google Places Autocomplete
        const initAutocomplete = async () => {
            if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
                return;
            }

            if (startInputRef.current && !startAutocomplete) {
                const autocomplete = new google.maps.places.Autocomplete(startInputRef.current);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    setStartPlace(place);
                });
                setStartAutocomplete(autocomplete);
            }

            if (endInputRef.current && !endAutocomplete) {
                const autocomplete = new google.maps.places.Autocomplete(endInputRef.current);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    setEndPlace(place);
                });
                setEndAutocomplete(autocomplete);
            }
        };

        // Wait for Google Maps to load
        const checkGoogleMaps = setInterval(() => {
            if (typeof google !== 'undefined' && google.maps && google.maps.places) {
                clearInterval(checkGoogleMaps);
                initAutocomplete();
            }
        }, 100);

        return () => clearInterval(checkGoogleMaps);
    }, [startAutocomplete, endAutocomplete]);

    const handlePersonaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(persona);
    };

    const handlePlanRoute = async () => {
        // If we have place objects from autocomplete, use them
        if (startPlace && endPlace) {
            onPlanRoute(startPlace, endPlace);
            return;
        }

        // Fallback: Use Geocoding API for text input
        if (startText && endText && typeof google !== 'undefined') {
            const geocoder = new google.maps.Geocoder();

            try {
                const [startResult, endResult] = await Promise.all([
                    geocoder.geocode({ address: startText }),
                    geocoder.geocode({ address: endText })
                ]);

                if (startResult.results[0] && endResult.results[0]) {
                    const startPlaceResult: google.maps.places.PlaceResult = {
                        geometry: { location: startResult.results[0].geometry.location },
                        formatted_address: startResult.results[0].formatted_address,
                        name: startText
                    };
                    const endPlaceResult: google.maps.places.PlaceResult = {
                        geometry: { location: endResult.results[0].geometry.location },
                        formatted_address: endResult.results[0].formatted_address,
                        name: endText
                    };
                    onPlanRoute(startPlaceResult, endPlaceResult);
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        }
    };

    const handleDetourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setDetourDistance(value);
        onDetourDistanceChange(value);
    };

    return (
        <div className="w-full md:w-80 h-auto md:h-full bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm z-10 relative overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <User className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 font-sans">Travel Profile</h1>
            </div>

            {/* Route Planning Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Navigation2 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Plan Route</h2>
                </div>

                <div className="flex flex-col gap-3">
                    <div>
                        <label htmlFor="start" className="text-xs font-semibold text-gray-600 mb-1 block">
                            Start Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={startInputRef}
                                type="text"
                                id="start"
                                placeholder="Enter start location"
                                value={startText}
                                onChange={(e) => setStartText(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="end" className="text-xs font-semibold text-gray-600 mb-1 block">
                            End Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={endInputRef}
                                type="text"
                                id="end"
                                placeholder="Enter destination"
                                value={endText}
                                onChange={(e) => setEndText(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handlePlanRoute}
                        disabled={(!startPlace && !startText) || (!endPlace && !endText)}
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
                    >
                        <Navigation2 className="w-4 h-4" />
                        Start Navigation
                    </button>

                    {routeInfo && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-xs font-semibold text-green-800 mb-1">Route Info</div>
                            <div className="text-sm text-green-700">
                                <div>Distance: {routeInfo.distance}</div>
                                <div>Duration: {routeInfo.duration}</div>
                            </div>
                        </div>
                    )}

                    {/* Detour Distance Slider */}
                    <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                <Sliders className="w-3 h-3" />
                                Max Detour
                            </label>
                            <span className="text-xs font-bold text-blue-600">{detourDistance} km</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.5"
                            value={detourDistance}
                            onChange={handleDetourChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>0.5 km</span>
                            <span>5 km</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Persona Section */}
            <form onSubmit={handlePersonaSubmit} className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-2">
                    <label htmlFor="persona" className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Your Persona
                    </label>
                    <textarea
                        id="persona"
                        className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-700 bg-gray-50 transition-all"
                        placeholder="e.g., I love Indian veg food and coins..."
                        value={persona}
                        onChange={(e) => setPersona(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    <Send className="w-4 h-4" />
                    Update Profile
                </button>

                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h3 className="text-sm font-bold text-blue-800 mb-2">Try these:</h3>
                    <ul className="text-sm text-blue-600 space-y-1 list-disc list-inside">
                        <li>"I love Indian food"</li>
                        <li>"Interested in Coins"</li>
                        <li>"Vegetarian foodie"</li>
                    </ul>
                </div>
            </form>

            <div className="mt-auto pt-4 text-xs text-gray-400 text-center">
                Powered by AI Mock-Filtering
            </div>
        </div>
    );
}
