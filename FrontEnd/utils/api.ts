import axios, { AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_NYC_API_BASE_URL;
const JOBS_ENDPOINT = process.env.NEXT_PUBLIC_DOB_JOBS_ENDPOINT;

// Types for NYC API response
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

// Our processed project type
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

export const constructionAPI = {
  async getActiveProjects(limit: number = 1000, offset: number = 0): Promise<NYCJobResponse[]> {
    try {
      const response: AxiosResponse<NYCJobResponse[]> = await axios.get(`${BASE_URL}/${JOBS_ENDPOINT}`, {
        params: {
          $limit: limit,
          $offset: offset,
          $where: "job_status_descrp IN('INITIAL', 'ACTIVE', 'PERMIT ISSUED')",
          $order: 'pre_filing_date DESC'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching construction data:', error);
      throw error;
    }
  },

  async getProjectsByBorough(borough: string): Promise<NYCJobResponse[]> {
    try {
      const response: AxiosResponse<NYCJobResponse[]> = await axios.get(`${BASE_URL}/${JOBS_ENDPOINT}`, {
        params: {
          $where: `borough = '${borough.toUpperCase()}'`,
          $limit: 500
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching borough data:', error);
      throw error;
    }
  }
};