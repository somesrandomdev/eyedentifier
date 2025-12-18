import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SENEGAL_BOUNDS: L.LatLngBoundsExpression = [
  [12.2, -17.5], // sud-ouest
  [16.8, -11.3], // nord-est
];

const SENEGAL_CENTER: L.LatLngTuple = [14.6928, -17.4467]; // Dakar

export default function MapSenegal({ citizens }: { citizens: any[] }) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. init map
    const map = L.map(containerRef.current, {
      maxBounds: SENEGAL_BOUNDS,
      minZoom: 7,
      maxZoom: 12,
    }).setView(SENEGAL_CENTER, 7);

    // 2. base layer – open street map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    // 3. Senegal-themed marker icon
    const senegalIcon = L.divIcon({
      html: `<div style="background:#009639;border:3px solid #FCD116;border-radius:50%;width:16px;height:16px;"></div>`,
      className: 'senegal-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    // 4. add citizen markers
    citizens.forEach((c) => {
      if (!c.lat || !c.lng) return;
      L.marker([c.lat, c.lng], { icon: senegalIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${c.prenoms} ${c.nom}</strong><br/>CNI: ${c.cni}<br/><img src="${c.photo_url}" class="w-16 h-20 object-cover rounded mt-2"/>`
        );
    });

    mapRef.current = map;
    return () => {
      map.remove();
    };
  }, [citizens]);

  return <div ref={containerRef} className="w-full h-96" />;
}