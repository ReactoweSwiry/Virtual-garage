import { Car, MaintenanceEvent } from '@/lib/types/Car';

import api from './base';
import { CarApiResponse } from '../interfaces/CarApiResponse';

export const getCars = async (page: number) => {
  const response = await api.get<CarApiResponse>(`/cars`, {
    params: {
      page,
    },
  });
  return response.data;
};

export const getCarById = async (
  id: string | string[] | undefined
): Promise<Car> => {
  if (!id) throw new Error('Car ID is required');
  const response = await api.get('/car/' + id);
  return response.data;
};

export const addAction = async (
  carId: number,
  values: MaintenanceEvent
) => {
  return await api.post(`/action/${carId}`, values);
};

export const deleteCarActionById = async (
  id: string | string[] | undefined
): Promise<void> => {
  if (!id) throw new Error('Car ID is required');
  console.log('Deleting event:', id);
  await api.delete('/action/' + id, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateCarActionById = async (
  id: string | string[] | undefined,
  carData: Partial<Car>
): Promise<Car> => {
  if (!id) throw new Error('Action ID is required');
  const response = await api.put('/action/' + id, carData);
  return response.data;
};

export const getMaintenanceDetails = async (
  id: string | string[] | undefined
): Promise<MaintenanceEvent> => {
  if (!id) throw new Error('Action ID is required');
  console.log('Fetching Maintenance Details:', id);
  const response = await api.get('/action/' + id);
  console.log('Fetched Maintenance Details:', response.data);
  return response.data;
};
