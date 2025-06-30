export interface Equipment {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
  pricing: {
    day: number;
    weekend: number;
    withDelivery: number;
  };
  bookings?: {
    title: string;
    start: string;
    end: string;
  }[];
}