import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import map to avoid SSR issues with Leaflet
const ConstructionMap = dynamic(
  () => import('@/components/Map/ConstructionMap'),
  { ssr: false }
);

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

export default function Home() {
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ConstructionProject | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/construction');
      const data = await response.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: ConstructionProject) => {
    setSelectedProject(project);
  };

  return (
    <>
      <Head>
        <title>NYC Construction Map</title>
        <meta name="description" content="Interactive map of NYC construction projects" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="h-screen flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 shadow-lg z-10">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">NYC Construction Map</h1>
            <p className="text-sm text-blue-100">
              {loading ? 'Loading...' : `Showing ${projects.length} active projects`}
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 relative">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading construction data...</p>
                </div>
              </div>
            ) : (
              <ConstructionMap 
                projects={projects} 
                onProjectClick={handleProjectClick}
              />
            )}
          </div>

          {/* Sidebar - Project Details */}
          {selectedProject && (
            <aside className="w-96 bg-white shadow-xl overflow-y-auto border-l border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Address</h3>
                    <p className="text-gray-900">{selectedProject.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Job Number</h3>
                      <p className="text-gray-900">{selectedProject.jobNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Borough</h3>
                      <p className="text-gray-900">{selectedProject.borough}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Project Type</h3>
                      <p className="text-gray-900">{selectedProject.projectType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Status</h3>
                      <p className={`font-medium ${
                        selectedProject.status === 'Approved' ? 'text-green-600' :
                        selectedProject.status === 'In Progress' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {selectedProject.status}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Description</h3>
                    <p className="text-gray-900">{selectedProject.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Floor Count</h3>
                      <p className="text-gray-900">{selectedProject.floorCount} floors</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Cost Estimate</h3>
                      <p className="text-gray-900">
                        ${selectedProject.costEstimate.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Permit Date</h3>
                      <p className="text-gray-900">
                        {new Date(selectedProject.permitDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Est. Completion</h3>
                      <p className="text-gray-900">
                        {new Date(selectedProject.estimatedCompletion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Owner</h3>
                    <p className="text-gray-900">{selectedProject.ownerName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Contractor</h3>
                    <p className="text-gray-900">{selectedProject.contractor}</p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
          <h3 className="font-bold text-sm mb-2">Project Types</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">New Building</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm">Alteration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Renovation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm">Demolition</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}