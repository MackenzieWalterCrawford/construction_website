import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect, useMemo } from 'react';
import L from 'leaflet';
import { NYC_CENTER, MAP_CONFIG } from '@/utils/constants';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom markers for different project types
const createCustomIcon = (type) => {
  const colors = {
    'NB': '#ff4444', // New Building - Red
    'A1': '#44ff44', // Alteration Type 1 - Green  
    'A2': '#4444ff', // Alteration Type 2 - Blue
    'A3': '#ffff44', // Alteration Type 3 - Yellow
    'DM': '#ff44ff', // Demolition - Magenta
    'default': '#44ffff' // Default - Cyan
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${colors[type] || colors.default};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

function MapUpdater({ projects, filters }) {
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
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    }
  }, [map, projects]);

  return null;
}

export default function ConstructionMap({ projects = [], filters, loading }) {
  const [selectedProject, setSelectedProject] = useState(null);

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
      // Add date filtering logic here if needed
      return true;
    });
  }, [projects, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nyc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading construction data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={NYC_CENTER}
        zoom={MAP_CONFIG.defaultZoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater projects={filteredProjects} filters={filters} />
        
        {filteredProjects.map(project => (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={createCustomIcon(project.jobType)}
            eventHandlers={{
              click: () => setSelectedProject(project)
            }}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-2">
                  {project.address}
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Job #:</span> {project.jobNumber}</p>
                  <p><span className="font-medium">Type:</span> {project.workType}</p>
                  <p><span className="font-medium">Status:</span> {project.jobStatus}</p>
                  <p><span className="font-medium">Borough:</span> {project.borough}</p>
                  {project.ownerName && (
                    <p><span className="font-medium">Owner:</span> {project.ownerName}</p>
                  )}
                  {project.estimatedCost > 0 && (
                    <p><span className="font-medium">Est. Cost:</span> ${project.estimatedCost.toLocaleString()}</p>
                  )}
                </div>
                {project.description && (
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
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-1000 text-sm">
        <h4 className="font-semibold mb-2">Project Types</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>New Building</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Alteration (A1)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Alteration (A2)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Alteration (A3)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
            <span>Demolition</span>
          </div>
        </div>
      </div>
    </div>
  );
}