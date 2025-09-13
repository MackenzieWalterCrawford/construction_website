import { NYC_BOROUGHS } from '@/utils/constants';

export default function Sidebar({ filters, onFiltersChange, projectCount, loading }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Filters
        </h2>
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${projectCount} projects found`}
        </p>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Borough Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Borough
          </label>
          <select
            value={filters.borough}
            onChange={(e) => handleFilterChange('borough', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nyc-blue focus:border-transparent"
          >
            <option value="">All Boroughs</option>
            {Object.entries(NYC_BOROUGHS).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Project Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Type
          </label>
          <select
            value={filters.projectType}
            onChange={(e) => handleFilterChange('projectType', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nyc-blue focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="NB">New Building</option>
            <option value="A1">Alteration Type 1</option>
            <option value="A2">Alteration Type 2</option>
            <option value="A3">Alteration Type 3</option>
            <option value="DM">Demolition</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nyc-blue focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600">
          Data from NYC Department of Buildings
        </p>
      </div>
    </div>
  );
}