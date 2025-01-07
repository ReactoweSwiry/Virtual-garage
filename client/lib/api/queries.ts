import api from './base';

export const getCars = async () => {
  const response = await api.get('cars');
  return response.data;
};
