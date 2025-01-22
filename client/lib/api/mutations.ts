import { Car, Action } from '@/lib/types/Car';

import api from './base';

export const addCar = async (car: Car) => {
  return await api.post('cars', car);
};

export const uploadCarImage = async (carId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await api.patch(`/car/${carId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addAction = async (
  carId: string,
  values: Omit<Action, 'id' | 'date'>
) => {
  return await api.post(`/action/${carId}`, values);
};

export const deleteCarActionById = async (actionId: number) => {
  await api.delete(`/action/${actionId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateCarActionById = async (
  id: string | string[] | undefined,
  values: Partial<Action>
) => {
  const response = await api.put(`/action/${id}`, values);
  return response.data;
};
