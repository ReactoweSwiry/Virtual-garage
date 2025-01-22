/**
 * Car types
 */

export type Car = {
  id?: number;
  name: string;
  model: string;
  plate_number: string;
  year: string;
  car_image?: string;
};

export type Action = {
  id: number;
  action: string;
  details?: string;
  service_station_name?: string;
  date: string;
  type: string | 'repair' | 'oil_change' | 'inspection' | 'other';
  cost: number;
};
export type CarWithActions = {
  car: Car;
  actions: Action[];
};
