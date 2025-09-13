import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

// Dynamically import the map component to avoid SSR issues
const ConstructionMap = dynamic(
  () => import('@/components/Map/ConstructionMap'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    borough: '',
    projectType: '',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchConstructionData();
  }, []);

  const fetchConstructionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/construction');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>NYC Construction Map - Real-time Construction Projects</title>
        <meta name="description" content="Interactive map showing real-time construction projects across New York City" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>

      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            filters={filters}
            onFiltersChange={setFilters}
            projectCount={projects.length}
            loading={loading}
          />
          
          <main className="flex-1 relative">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Error Loading Data
                  </h2>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button 
                    onClick={fetchConstructionData}
                    className="px-4 py-2 bg-nyc-blue text-white rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <ConstructionMap 
                projects={projects}
                filters={filters}
                loading={loading}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
}