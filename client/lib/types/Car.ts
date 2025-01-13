export type Car = {
  id?: number;
  name: string;
  model: string;
  plate_number: string;
  year: string;
  car_image?: string;
};
export interface MaintenanceEvent {
  id: number;
  action?: string;
  date: string;
  type: 'repair' | 'oil_change' | 'inspection' | 'other';
  description: string;
  cost: number;
}

