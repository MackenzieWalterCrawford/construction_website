import type { NextApiRequest, NextApiResponse } from 'next';

// Mock construction project data representing NYC construction sites
const mockProjects = [
  {
    id: '1',
    jobNumber: 'JOB123456',
    address: '123 Broadway, Manhattan, NY 10007',
    latitude: 40.7128,
    longitude: -74.0060,
    projectType: 'New Building',
    workType: 'Construction',
    status: 'Approved',
    borough: 'Manhattan',
    permitDate: '2024-01-15',
    estimatedCompletion: '2025-06-30',
    description: 'Construction of new 12-story residential building with ground floor retail space',
    ownerName: 'ABC Development Corp',
    contractor: 'XYZ Construction',
    costEstimate: 5000000,
    floorCount: 12
  },
  {
    id: '2',
    jobNumber: 'JOB789012',
    address: '456 5th Avenue, Brooklyn, NY 11215',
    latitude: 40.6782,
    longitude: -73.9442,
    projectType: 'Alteration',
    workType: 'Renovation',
    status: 'In Progress',
    borough: 'Brooklyn',
    permitDate: '2024-02-20',
    estimatedCompletion: '2024-12-31',
    description: 'Major renovation of existing structure including facade restoration',
    ownerName: 'DEF Properties LLC',
    contractor: 'Builder Pro Inc',
    costEstimate: 2500000,
    floorCount: 8
  },
  {
    id: '3',
    jobNumber: 'JOB345678',
    address: '789 Queens Blvd, Queens, NY 11373',
    latitude: 40.7282,
    longitude: -73.8677,
    projectType: 'New Building',
    workType: 'Construction',
    status: 'In Progress',
    borough: 'Queens',
    permitDate: '2023-11-10',
    estimatedCompletion: '2025-03-15',
    description: 'Mixed-use development with residential units and commercial space',
    ownerName: 'Queens Development Group',
    contractor: 'Metro Builders LLC',
    costEstimate: 8500000,
    floorCount: 15
  },
  {
    id: '4',
    jobNumber: 'JOB901234',
    address: '321 Grand Concourse, Bronx, NY 10451',
    latitude: 40.8448,
    longitude: -73.9242,
    projectType: 'Renovation',
    workType: 'Interior Work',
    status: 'Approved',
    borough: 'Bronx',
    permitDate: '2024-03-05',
    estimatedCompletion: '2024-10-20',
    description: 'Interior renovation and modernization of apartment building',
    ownerName: 'Bronx Housing Partners',
    contractor: 'Reliable Renovations',
    costEstimate: 1800000,
    floorCount: 6
  },
  {
    id: '5',
    jobNumber: 'JOB567890',
    address: '654 Richmond Terrace, Staten Island, NY 10301',
    latitude: 40.6437,
    longitude: -74.0765,
    projectType: 'New Building',
    workType: 'Construction',
    status: 'Approved',
    borough: 'Staten Island',
    permitDate: '2024-01-25',
    estimatedCompletion: '2025-08-30',
    description: 'New single-family residential development',
    ownerName: 'SI Builders Inc',
    contractor: 'Island Construction Co',
    costEstimate: 950000,
    floorCount: 3
  },
  {
    id: '6',
    jobNumber: 'JOB111213',
    address: '100 Wall Street, Manhattan, NY 10005',
    latitude: 40.7074,
    longitude: -74.0089,
    projectType: 'Alteration',
    workType: 'Commercial Renovation',
    status: 'In Progress',
    borough: 'Manhattan',
    permitDate: '2023-09-15',
    estimatedCompletion: '2024-11-30',
    description: 'Office building renovation and modernization',
    ownerName: 'Wall Street Properties',
    contractor: 'Elite Commercial Builders',
    costEstimate: 12000000,
    floorCount: 20
  },
  {
    id: '7',
    jobNumber: 'JOB141516',
    address: '888 Flatbush Avenue, Brooklyn, NY 11226',
    latitude: 40.6501,
    longitude: -73.9598,
    projectType: 'Demolition',
    workType: 'Demolition',
    status: 'In Progress',
    borough: 'Brooklyn',
    permitDate: '2024-04-01',
    estimatedCompletion: '2024-09-15',
    description: 'Controlled demolition of abandoned warehouse',
    ownerName: 'Brooklyn Redevelopment Corp',
    contractor: 'Demo Experts LLC',
    costEstimate: 450000,
    floorCount: 4
  },
  {
    id: '8',
    jobNumber: 'JOB171819',
    address: '555 Madison Avenue, Manhattan, NY 10022',
    latitude: 40.7614,
    longitude: -73.9776,
    projectType: 'Alteration',
    workType: 'Facade Work',
    status: 'Approved',
    borough: 'Manhattan',
    permitDate: '2024-02-28',
    estimatedCompletion: '2024-12-20',
    description: 'Facade restoration and waterproofing',
    ownerName: 'Midtown Real Estate Group',
    contractor: 'Facade Specialists Inc',
    costEstimate: 3200000,
    floorCount: 18
  }
];

type ApiResponse = {
  data: typeof mockProjects;
  total: number;
  message: string;
} | {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Simulate API delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 500));

  // Extract query parameters for filtering
  const { borough, projectType, status } = req.query;

  // Filter projects based on query parameters
  let filteredProjects = mockProjects;

  if (borough && typeof borough === 'string') {
    filteredProjects = filteredProjects.filter(
      p => p.borough.toLowerCase() === borough.toLowerCase()
    );
  }

  if (projectType && typeof projectType === 'string') {
    filteredProjects = filteredProjects.filter(
      p => p.projectType.toLowerCase() === projectType.toLowerCase()
    );
  }

  if (status && typeof status === 'string') {
    filteredProjects = filteredProjects.filter(
      p => p.status.toLowerCase() === status.toLowerCase()
    );
  }

  res.status(200).json({
    data: filteredProjects,
    total: filteredProjects.length,
    message: 'Mock data - backend integration pending'
  });
}