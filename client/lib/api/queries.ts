import api from './base';

export const getCars = async () => {
  const response = await api.get('cars');
  return response.data;
};
import { Car } from '@/lib/types/Car';
import axios from 'axios';

export const getCarById = async (id: string | string[] | undefined): Promise<Car> => {
  if (!id) throw new Error('Car ID is required');
  const response = await api.get('car/' + id);
  return response.data;
};
