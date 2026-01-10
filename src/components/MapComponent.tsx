'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Location } from '@/utils/mockData';

interface MapComponentProps {
    locations: Location[];
    onNearTarget: (target: Location) => void;
}

export default function MapComponent({ locations, onNearTarget }: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const simulationInterval = useRef<NodeJS.Timeout | null>(null);

    // Default SF User location
    const initialUserPos = { lat: 37.7739, lng: -122.4312 }; // Somewhere central

    useEffect(() => {
        const initMap = async () => {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                console.error('Missing Google Maps API Key');
                return;
            }

            // Configure the API key using setOptions (required for v2.x)
            setOptions({
                key: apiKey,
                v: 'weekly',
            });

            try {
                const { Map } = await importLibrary('maps') as google.maps.MapsLibrary;
                const { Marker } = await importLibrary('marker') as google.maps.MarkerLibrary;

                if (mapRef.current) {
                    const mapInstance = new Map(mapRef.current, {
                        center: { lat: 37.7749, lng: -122.4194 },
                        zoom: 13,
                        mapId: 'DEMO_MAP_ID', // Required for advanced markers if used, or just placeholder
                        disableDefaultUI: false,
                        clickableIcons: false,
                    });
                    setMap(mapInstance);

                    // Create User Marker
                    const user = new Marker({
                        position: initialUserPos,
                        map: mapInstance,
                        title: 'You',
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#4285F4',
                            fillOpacity: 1,
                            strokeColor: 'white',
                            strokeWeight: 2,
                        },
                    });
                    setUserMarker(user);
                }
            } catch (error) {
                console.error('Error loading Google Maps', error);
            }
        };

        initMap();
    }, []);

    // Update Markers when locations change
    useEffect(() => {
        if (!map) return;

        // Clear old markers
        markers.forEach(m => m.setMap(null));

        // Add new markers
        const newMarkers = locations.map(loc => {
            return new google.maps.Marker({
                position: { lat: loc.lat, lng: loc.lng },
                map,
                title: loc.name,
                animation: google.maps.Animation.DROP,
            });
        });
        setMarkers(newMarkers);
    }, [map, locations]);

    const startSimulation = () => {
        if (!map || !userMarker || locations.length === 0) return;

        // Pick the first location in the list as the target
        const target = locations[0];
        const targetPos = { lat: target.lat, lng: target.lng };
        let currentPos = userMarker.getPosition()?.toJSON() || initialUserPos;

        setIsSimulating(true);

        let steps = 0;
        const maxSteps = 100; // Animation frames

        simulationInterval.current = setInterval(() => {
            steps++;
            // Simple lerp
            const t = steps / maxSteps;
            const lat = currentPos.lat + (targetPos.lat - currentPos.lat) * 0.05; // Move 5% towards target each step
            const lng = currentPos.lng + (targetPos.lng - currentPos.lng) * 0.05;

            currentPos = { lat, lng };
            userMarker.setPosition(currentPos);
            map.panTo(currentPos);

            // Check distance
            const dist = Math.sqrt(
                Math.pow(targetPos.lat - currentPos.lat, 2) +
                Math.pow(targetPos.lng - currentPos.lng, 2)
            );

            // Roughly 0.002 degrees is close enough (~200m)
            if (dist < 0.002) {
                onNearTarget(target);
                stopSimulation();
            }

            if (steps >= 1000) stopSimulation(); // Safety break
        }, 100);
    };

    const stopSimulation = () => {
        if (simulationInterval.current) clearInterval(simulationInterval.current);
        setIsSimulating(false);
    };

    return (
        <div className="relative w-full h-full bg-gray-100">
            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-100/80 backdrop-blur-sm">
                    <div className="p-6 bg-white rounded-xl shadow-xl max-w-md text-center">
                        <h2 className="text-lg font-bold text-red-600 mb-2">API Key Missing</h2>
                        <p className="text-gray-600">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.</p>
                    </div>
                </div>
            )}

            <div ref={mapRef} className="w-full h-full" />

            {/* Simulation Control */}
            <div className="absolute bottom-8 right-8 z-10">
                <button
                    onClick={isSimulating ? stopSimulation : startSimulation}
                    disabled={locations.length === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg font-semibold transition-all transform ${isSimulating
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                        } ${locations.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSimulating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Stop Walking
                        </>
                    ) : (
                        <>
                            <Navigation className="w-5 h-5" />
                            Simulate Walking
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
