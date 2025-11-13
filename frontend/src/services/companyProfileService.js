import API from '../config/api';

// Get company profile
export const getCompanyProfile = async () => {
  try {
    const res = await API.get('/company-profile');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch company profile');
  }
};

// Get company stats
export const getCompanyStats = async () => {
  try {
    const res = await API.get('/company-profile/stats');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch company stats');
  }
};

export default {
  getCompanyProfile,
  getCompanyStats
};