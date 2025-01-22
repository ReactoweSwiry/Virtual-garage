import { Car, Action, CarWithActions } from '@/lib/types/Car';

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

export const getCarById = async (id: string) => {
  const response = await api.get<CarWithActions>(`/car/${id}`);
  return response.data;
};

export const getAction = async (id: string | string[] | undefined) => {
  const response = await api.get<Action>(`/action/${id}`);
  return response.data;
};
