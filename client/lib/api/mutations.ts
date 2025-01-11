import api from './base';
import { Car } from '../types/Car';

export const addCar = async (car: Car) => {
  return await api.post('cars', car);
};

export const uploadCarImage = async (carId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await api.patch(`car/${carId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
