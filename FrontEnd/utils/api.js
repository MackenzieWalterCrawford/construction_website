import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_NYC_API_BASE_URL;
const JOBS_ENDPOINT = process.env.NEXT_PUBLIC_DOB_JOBS_ENDPOINT;

export const constructionAPI = {
  async getActiveProjects(limit = 1000, offset = 0) {
    try {
      const response = await axios.get(`${BASE_URL}/${JOBS_ENDPOINT}`, {
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

  async getProjectsByBorough(borough) {
    try {
      const response = await axios.get(`${BASE_URL}/${JOBS_ENDPOINT}`, {
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