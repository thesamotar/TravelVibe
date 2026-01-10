'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';
import { Location, INITIAL_LOCATIONS, filterLocations } from '@/utils/mockData';
import { X } from 'lucide-react';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [toast, setToast] = useState<{ visible: boolean; message: string; title: string } | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [routePlaces, setRoutePlaces] = useState<{ start: google.maps.places.PlaceResult | null; end: google.maps.places.PlaceResult | null } | null>(null);
  const [detourDistance, setDetourDistance] = useState(1); // km

  const handleUpdateProfile = (persona: string) => {
    const filtered = filterLocations(persona);
    setLocations(filtered);

    // Reset toast if any
    setToast(null);
  };

  const handlePlanRoute = (start: google.maps.places.PlaceResult | null, end: google.maps.places.PlaceResult | null) => {
    setRoutePlaces({ start, end });
  };

  const handleRouteCalculated = (distance: string, duration: string) => {
    setRouteInfo({ distance, duration });
  };

  const handleDetourDistanceChange = (distance: number) => {
    setDetourDistance(distance);
  };

  const handleNearTarget = (target: Location) => {
    setToast({
      visible: true,
      title: 'Interested in a detour?',
      message: `You are near ${target.name}!`,
    });
  };

  return (
    <main className="flex h-screen w-screen flex-col md:flex-row bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onUpdateProfile={handleUpdateProfile}
        onPlanRoute={handlePlanRoute}
        onDetourDistanceChange={handleDetourDistanceChange}
        routeInfo={routeInfo}
      />

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapComponent
          locations={locations}
          onNearTarget={handleNearTarget}
          routePlaces={routePlaces}
          onRouteCalculated={handleRouteCalculated}
          detourDistance={detourDistance}
        />

        {/* Beautiful Toast Notification */}
        {toast && toast.visible && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="bg-white/90 backdrop-blur-md border border-blue-200 shadow-2xl rounded-2xl p-4 flex items-start gap-4 max-w-sm w-full">
              <div className="bg-blue-100 p-2 rounded-full">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900">{toast.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
