import { BookingEvent } from './booking';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  active: boolean;
  pricing: {
    day: number;
    weekend: number;
    withDelivery: number;
  };
  bookings?: BookingEvent[];  // <-- hier den korrekten Typ setzen
}