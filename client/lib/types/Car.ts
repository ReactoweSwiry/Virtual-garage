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
  date: string;
  type: string;
  description: string;
  cost: number;
}
