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
  bookings?: {
    title: string;
    start: string;
    end: string;
  }[];
}