// pages/api/construction.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock construction project data
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
    description: 'Construction of new residential building',
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
    description: 'Major renovation of existing structure',
    ownerName: 'DEF Properties LLC',
    contractor: 'Builder Pro Inc',
    costEstimate: 2500000,
    floorCount: 8
  },
  // Add more mock projects as needed
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Basic filtering by borough if provided
  const { borough } = req.query;
  let filteredProjects = mockProjects;
  
  if (borough && typeof borough === 'string') {
    filteredProjects = mockProjects.filter(
      p => p.borough.toLowerCase() === borough.toLowerCase()
    );
  }
  
  res.status(200).json({
    data: filteredProjects,
    total: filteredProjects.length,
    message: 'Mock data - backend integration pending'
  });
}