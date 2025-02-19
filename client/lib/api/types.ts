export type Car = {
  id: string;
  name: string;
  model: string;
  plateNumber: string;
  year: string;
  carImage?: string; //Base64
};

export type Action = {
  id: string;
  carId: string;
  action: string;
  type: string;
  cost: number;
  details?: string;
  serviceStation?: string;
  date: string;
};
