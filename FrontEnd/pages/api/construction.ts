import { NextApiRequest, NextApiResponse } from 'next';

interface NYCJobResponse {
  job_: string;
  house_: string;
  street_name: string;
  borough: string;
  latitude: string;
  longitude: string;
  job_type: string;
  job_status_descrp: string;
  work_type: string;
  pre_filing_date: string;
  job_description?: string;
  owner_name: string;
  initial_cost?: string;
}

interface ProcessedProject {
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

interface ErrorResponse {
  message: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProcessedProject[] | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const BASE_URL = 'https://data.cityofnewyork.us/resource/';
    const ENDPOINT = 'ipu4-2q9a.json';
    
    // Fetch recent construction projects
    const response = await fetch(
      `${BASE_URL}/${ENDPOINT}?$limit=500`
    );

    if (!response.ok) {
      throw new Error(`NYC API responded with status: ${response.status}`);
    }

    const data: NYCJobResponse[] = await response.json();
    
    // Filter and transform data
    const processedData: ProcessedProject[] = data
      .filter((project: NYCJobResponse) => project.latitude && project.longitude)
      .map((project: NYCJobResponse) => ({
        id: project.job_,
        jobNumber: project.job_,
        address: `${project.house_} ${project.street_name}, ${project.borough}`,
        latitude: parseFloat(project.latitude),
        longitude: parseFloat(project.longitude),
        borough: project.borough,
        jobType: project.job_type,
        jobStatus: project.job_status_descrp,
        workType: project.work_type,
        permitDate: project.pre_filing_date,
        description: project.job_description || 'No description available',
        ownerName: project.owner_name,
        estimatedCost: parseFloat(project.initial_cost || '0') || 0
      }));

    res.status(200).json(processedData);
  } catch (error) {
    console.error('Construction API Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch construction data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}