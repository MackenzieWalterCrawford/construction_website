import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Filters } from '@/components/Layout/Sidebar';

// Types
export interface Project {
  id: string;
  jobNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  borough: string;
  jobType: string;
  jobStatus: string;
  workType: string;
  permitDate: string;
  description: string;
  ownerName: string;
  estimatedCost: number;
}

interface ConstructionMapProps {
  projects: Project[];
  filters: Filters;
  loading: boolean;
}

interface MapUpdaterProps {
  projects: Project[];
  filters: Filters;
}

// NYC Center coordinates
const NYC_CENTER: [number, number] = [40.7128, -74.0060];
const DEFAULT_ZOOM = 11;

// Fix for default markers in react-leaflet
// Only delete if the property exists
if (L.Icon.Default.prototype._getIconUrl) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom markers for different project types
const createCustomIcon = (type: string): L.DivIcon => {
  const colors: Record<string, string> = {
    'NB': '#ef4444', // New Building - Red
    'A1': '#22c55e', // Alteration Type 1 - Green  
    'A2': '#3b82f6', // Alteration Type 2 - Blue
    'A3': '#eab308', // Alteration Type 3 - Yellow
    'DM': '#ec4899', // Demolition - Pink
    'default': '#06b6d4' // Default - Cyan
  };

  const color = colors[type] || colors.default;

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });
};

const MapUpdater: React.FC<MapUpdaterProps> = ({ projects }) => {
  const map = useMap();
  
  useEffect(() => {
    if (projects.length > 0) {
      const group = new L.FeatureGroup();
      projects.forEach(project => {
        if (project.latitude && project.longitude) {
          const marker = L.marker([project.latitude, project.longitude]);
          group.addLayer(marker);
        }
      });
      
      if (group.getLayers().length > 0) {
        const bounds = group.getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      // Reset to NYC center if no projects
      map.setView(NYC_CENTER, DEFAULT_ZOOM);
    }
  }, [map, projects]);

  return null;
};

const ConstructionMap: React.FC<ConstructionMapProps> = ({ projects = [], filters, loading }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    if (!projects.length) return [];
    
    return projects.filter(project => {
      if (filters.borough && project.borough !== filters.borough) {
        return false;
      }
      if (filters.projectType && project.jobType !== filters.projectType) {
        return false;
      }
      return true;
    });
  }, [projects, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading construction data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={NYC_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater projects={filteredProjects} filters={filters} />
        
        {filteredProjects.map((project) => (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={createCustomIcon(project.jobType)}
            eventHandlers={{
              click: () => setSelectedProject(project),
            }}
          >
            <Popup>
              <div className="p-2 max-w-sm">
                <h3 className="font-bold text-sm mb-1">{project.address}</h3>
                <div className="text-xs space-y-1">
                  <p><span className="font-semibold">Type:</span> {project.jobType}</p>
                  <p><span className="font-semibold">Status:</span> {project.jobStatus}</p>
                  <p><span className="font-semibold">Work:</span> {project.workType}</p>
                  <p><span className="font-semibold">Borough:</span> {project.borough}</p>
                  {project.estimatedCost > 0 && (
                    <p><span className="font-semibold">Est. Cost:</span> ${project.estimatedCost.toLocaleString()}</p>
                  )}
                </div>
                {project.description && project.description !== 'No description available' && (
                  <p className="mt-2 text-xs text-gray-600">
                    {project.description.substring(0, 150)}
                    {project.description.length > 150 ? '...' : ''}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000] text-sm">
        <h4 className="font-semibold mb-2 text-gray-800">Project Types</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2 border-2 border-white shadow"></div>
            <span className="text-xs">New Building (NB)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2 border-2 border-white shadow"></div>
            <span className="text-xs">Alteration A1</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2 border-2 border-white shadow"></div>
            <span className="text-xs">Alteration A2</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2 border-2 border-white shadow"></div>
            <span className="text-xs">Alteration A3</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-pink-500 mr-2 border-2 border-white shadow"></div>
            <span className="text-xs">Demolition (DM)</span>
          </div>
        </div>
        {filteredProjects.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-600">
              Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstructionMap;