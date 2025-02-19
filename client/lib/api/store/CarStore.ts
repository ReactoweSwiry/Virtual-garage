import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { Car } from '../types';

const saveCarsToStorage = async (cars: Car[]) => {
  try {
    await AsyncStorage.setItem('cars', JSON.stringify(cars));
  } catch (error) {
    console.error('Error saving cars:', error);
  }
};

type CarStore = {
  cars: Car[];
  addCar: (car: Omit<Car, 'id'>) => void;
  uploadImage: (carId: string, imageUri: string) => void;
  removeCar: (carId: string) => void;
  getCars: () => void;
  getCar: (carId: string) => Car | undefined;
};

export const useCarStore = create<CarStore>((set, get) => ({
  cars: [],
  getCars: async () => {
    const storedCars = await AsyncStorage.getItem('cars');
    const cars = storedCars ? JSON.parse(storedCars) : [];
    set({ cars });
  },
  addCar: async (car) => {
    set((state) => {
      const newCar = {
        id: nanoid(),
        ...car,
      };
      const newCars: Car[] = [...state.cars, newCar];
      saveCarsToStorage(newCars);
      return { cars: newCars };
    });
  },
  uploadImage: (carId, imageUri) => {
    set((state) => {
      const car = get().cars.find((car) => car.id === carId);
      const updatedCar = {
        carImage: imageUri,
        ...car,
      } as Car;
      const updatedCars = state.cars.map((car) =>
        car.id === updatedCar.id ? updatedCar : car
      );
      saveCarsToStorage(updatedCars);
      return { cars: updatedCars };
    });
  },
  removeCar: async (carId) => {
    set((state) => {
      const newCars = state.cars.filter((car) => car.id !== carId);
      saveCarsToStorage(newCars);
      return { cars: newCars };
    });
  },
  getCar: (carId) => {
    return get().cars.find((car) => car.id === carId);
  },
}));
