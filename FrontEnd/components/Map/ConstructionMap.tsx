'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons by project type
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const markerColors = {
  'New Building': '#ef4444',      // red
  'Alteration': '#3b82f6',        // blue
  'Demolition': '#f59e0b',        // orange
  'Renovation': '#10b981',        // green
  'default': '#6b7280',           // gray
};

interface ConstructionProject {
  id: string;
  jobNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  projectType: string;
  workType: string;
  status: string;
  borough: string;
  permitDate: string;
  estimatedCompletion: string;
  description: string;
  ownerName: string;
  contractor: string;
  costEstimate: number;
  floorCount: number;
}

interface ConstructionMapProps {
  projects: ConstructionProject[];
  onProjectClick?: (project: ConstructionProject) => void;
}

export default function ConstructionMap({ projects, onProjectClick }: ConstructionMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render map on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  // NYC coordinates
  const nycCenter: [number, number] = [40.7128, -74.0060];

  return (
    <MapContainer
      center={nycCenter}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {projects.map((project) => {
        const color = markerColors[project.projectType as keyof typeof markerColors] || markerColors.default;
        const icon = createCustomIcon(color);

        return (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onProjectClick) {
                  onProjectClick(project);
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2">{project.address}</h3>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job #:</span>
                    <span className="font-medium">{project.jobNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{project.projectType}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      project.status === 'Approved' ? 'text-green-600' :
                      project.status === 'In Progress' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Borough:</span>
                    <span className="font-medium">{project.borough}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floors:</span>
                    <span className="font-medium">{project.floorCount}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600 line-clamp-2">{project.description}</p>
                </div>

                <button
                  onClick={() => onProjectClick && onProjectClick(project)}
                  className="mt-2 w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}