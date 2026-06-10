"use client";
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon missing issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks and moving the marker
function LocationMarker({ position, setPosition, setAddress }: { position: L.LatLng | null, setPosition: (p: L.LatLng) => void, setAddress: (a: string) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      reverseGeocode(e.latlng);
    },
  });

  const reverseGeocode = async (latlng: L.LatLng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          reverseGeocode(pos);
        }
      }}
    />
  );
}

export default function MapLogic({ setLocationInput }: { setLocationInput: (address: string) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
          setPosition(latlng);
          // Reverse geocode the initial location
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              setLocationInput(data.display_name);
            }
          } catch (err) {
            console.error("Geocoding failed", err);
          }
        },
        (err) => {
          console.warn("Geolocation denied or failed", err);
          // Default to a central location (e.g. New York) if denied
          setPosition(new L.LatLng(40.7128, -74.0060));
        },
        { enableHighAccuracy: true }
      );
    } else {
      setPosition(new L.LatLng(40.7128, -74.0060));
    }
  }, []);

  if (!position) return <div className="w-full h-full bg-[#111] animate-pulse flex items-center justify-center text-gray-500">Locating...</div>;

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="w-full h-full rounded-3xl z-0 relative">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <LocationMarker position={position} setPosition={setPosition} setAddress={setLocationInput} />
    </MapContainer>
  );
}
