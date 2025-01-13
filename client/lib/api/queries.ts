import axios from 'axios';

import { Car } from '@/lib/types/Car';

import api from './base';

export const getCars = async () => {
  const response = await api.get('cars');
  return response.data;
};

export const getCarById = async (
  id: string | string[] | undefined
): Promise<Car> => {
  if (!id) throw new Error('Car ID is required');
  const response = await api.get('car/' + id);
  return response.data;
};
export const getCarMaintenanceById = async (
  id: string | string[] | undefined
): Promise<Car> => {
  if (!id) throw new Error('Car ID is required');
  const response = await api.get('car/' + id + '/maintenance');
  return response.data;
};
