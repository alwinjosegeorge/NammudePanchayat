import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report, categoryIcons } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface IssuesMapProps {
  reports: Report[];
  className?: string;
}

const statusColors: Record<string, string> = {
  submitted: '#0ea5e9',
  received: '#0ea5e9',
  assigned: '#f59e0b',
  inProgress: '#f97316',
  resolved: '#22c55e',
  closed: '#6b7280',
};

export function IssuesMap({ reports, className = "h-96 w-full rounded-lg" }: IssuesMapProps) {
  const { t } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default center (Kerala, India)
  const defaultCenter: [number, number] = [10.8505, 76.2711];
  
  // Calculate center based on reports if available
  const center: [number, number] = reports.length > 0
    ? [
        reports.reduce((sum, r) => sum + r.lat, 0) / reports.length,
        reports.reduce((sum, r) => sum + r.lng, 0) / reports.length,
      ]
    : defaultCenter;

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Initialize map
    const map = L.map(containerRef.current).setView(center, reports.length > 0 ? 10 : 8);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add markers for each report
    reports.forEach((report) => {
      const color = statusColors[report.status] || '#0ea5e9';
      const emoji = categoryIcons[report.category] || '📍';
      
      const icon = L.divIcon({
        html: `
          <div style="
            background: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            ${emoji}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([report.lat, report.lng], { icon }).addTo(map);
      
      const statusLabel = t.status[report.status as keyof typeof t.status] || report.status;
      const categoryLabel = t.categories[report.category as keyof typeof t.categories] || report.category;
      
      marker.bindPopup(`
        <div style="padding: 8px; min-width: 180px;">
          <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${report.title}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${categoryLabel}</p>
          <span style="
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 500;
            background: ${color}22;
            color: ${color};
          ">${statusLabel}</span>
          <p style="font-size: 11px; color: #888; margin-top: 8px;">${report.panchayat}</p>
        </div>
      `);

      markersRef.current.push(marker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [reports, t]);

  return (
    <div ref={containerRef} className={className} />
  );
}
