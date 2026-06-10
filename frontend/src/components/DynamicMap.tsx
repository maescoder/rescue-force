"use client";
import dynamic from 'next/dynamic';

const MapLogic = dynamic(() => import('./MapLogic'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#111] animate-pulse flex items-center justify-center text-gray-500 rounded-3xl">Loading Map Core...</div>
});

export default function DynamicMap({ setLocationInput }: { setLocationInput: (address: string) => void }) {
  return <MapLogic setLocationInput={setLocationInput} />;
}
