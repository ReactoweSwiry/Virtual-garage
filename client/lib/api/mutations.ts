import api from './base';
import { Car } from '../types/Car';

export const addCar = async (car: Car) => {
  return await api.post('cars', car);
};
