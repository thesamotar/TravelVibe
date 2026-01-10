'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Location } from '@/utils/mockData';

interface MapComponentProps {
    locations: Location[];
    onNearTarget: (target: Location) => void;
    routePlaces: { start: google.maps.places.PlaceResult | null; end: google.maps.places.PlaceResult | null } | null;
    onRouteCalculated: (distance: string, duration: string) => void;
    detourDistance: number;
}

export default function MapComponent({ locations, onNearTarget, routePlaces, onRouteCalculated, detourDistance }: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const simulationInterval = useRef<NodeJS.Timeout | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [routePolyline, setRoutePolyline] = useState<google.maps.Polyline | null>(null);
    const [startMarker, setStartMarker] = useState<google.maps.Marker | null>(null);
    const [endMarker, setEndMarker] = useState<google.maps.Marker | null>(null);

    // Default SF User location (fallback)
    const defaultPos = { lat: 37.7749, lng: -122.4194 };
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

                // Get user's current location
                const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
                    return new Promise((resolve) => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const userPos = {
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude,
                                    };
                                    setUserLocation(userPos);
                                    resolve(userPos);
                                },
                                (error) => {
                                    console.warn('Geolocation error:', error.message);
                                    resolve(defaultPos);
                                }
                            );
                        } else {
                            console.warn('Geolocation not supported');
                            resolve(defaultPos);
                        }
                    });
                };

                const initialPos = await getUserLocation();

                if (mapRef.current) {
                    const mapInstance = new Map(mapRef.current, {
                        center: initialPos,
                        zoom: 13,
                        mapId: 'DEMO_MAP_ID',
                        disableDefaultUI: false,
                        clickableIcons: false,
                    });
                    setMap(mapInstance);

                    // Create User Marker at actual user location
                    const user = new Marker({
                        position: initialPos,
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

    // Handle Route Planning
    useEffect(() => {
        if (!map || !routePlaces || !routePlaces.start || !routePlaces.end) {
            // Clear route if no places
            if (routePolyline) {
                routePolyline.setMap(null);
                setRoutePolyline(null);
            }
            if (startMarker) {
                startMarker.setMap(null);
                setStartMarker(null);
            }
            if (endMarker) {
                endMarker.setMap(null);
                setEndMarker(null);
            }
            return;
        }

        const calculateRoute = async () => {
            const directionsService = new google.maps.DirectionsService();

            const startLocation = routePlaces.start?.geometry?.location;
            const endLocation = routePlaces.end?.geometry?.location;

            if (!startLocation || !endLocation) return;

            try {
                const result = await directionsService.route({
                    origin: startLocation,
                    destination: endLocation,
                    travelMode: google.maps.TravelMode.DRIVING,
                });

                if (result.routes[0]) {
                    const route = result.routes[0];
                    const leg = route.legs[0];

                    // Clear old polyline
                    if (routePolyline) {
                        routePolyline.setMap(null);
                    }

                    // Draw new polyline
                    const polyline = new google.maps.Polyline({
                        path: route.overview_path,
                        strokeColor: '#4285F4',
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                        map,
                    });
                    setRoutePolyline(polyline);

                    // Add start marker
                    if (startMarker) startMarker.setMap(null);
                    const newStartMarker = new google.maps.Marker({
                        position: startLocation,
                        map,
                        title: 'Start',
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#34A853',
                            fillOpacity: 1,
                            strokeColor: 'white',
                            strokeWeight: 2,
                        },
                    });
                    setStartMarker(newStartMarker);

                    // Add end marker
                    if (endMarker) endMarker.setMap(null);
                    const newEndMarker = new google.maps.Marker({
                        position: endLocation,
                        map,
                        title: 'End',
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#EA4335',
                            fillOpacity: 1,
                            strokeColor: 'white',
                            strokeWeight: 2,
                        },
                    });
                    setEndMarker(newEndMarker);

                    // Fit bounds to show entire route
                    const bounds = new google.maps.LatLngBounds();
                    route.overview_path.forEach(point => bounds.extend(point));
                    map.fitBounds(bounds);

                    // Call back with route info
                    onRouteCalculated(leg.distance?.text || '', leg.duration?.text || '');
                }
            } catch (error) {
                console.error('Error calculating route:', error);
            }
        };

        calculateRoute();
    }, [map, routePlaces]);

    const startSimulation = () => {
        if (!map || !userMarker || locations.length === 0) return;

        // Pick the first location in the list as the target
        const target = locations[0];
        const targetPos = { lat: target.lat, lng: target.lng };
        let currentPos = userMarker.getPosition()?.toJSON() || defaultPos;

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
