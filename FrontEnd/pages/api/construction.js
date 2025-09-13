export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const BASE_URL = 'https://data.cityofnewyork.us/resource';
    const ENDPOINT = 'ipu4-2q9a.json';
    
    // Fetch recent construction projects
    const response = await fetch(
      `${BASE_URL}/${ENDPOINT}?$limit=500&$where=job_status_descrp IN('ACTIVE', 'PERMIT ISSUED')&$order=pre_filing_date DESC`
    );

    if (!response.ok) {
      throw new Error(`NYC API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter and transform data
    const processedData = data
      .filter(project => project.latitude && project.longitude)
      .map(project => ({
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
        estimatedCost: project.initial_cost || 0
      }));

    res.status(200).json(processedData);
  } catch (error) {
    console.error('Construction API Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch construction data',
      error: error.message 
    });
  }
}