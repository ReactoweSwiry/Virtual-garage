import { Car } from '../types/Car';

export interface CarApiResponse {
  cars: Car[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}
