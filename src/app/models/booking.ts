export interface Booking {
  id?: string;
  equipmentId: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  status?: 'offen' | 'bestätigt' | 'storniert'; // <-- optional
}

export interface BookingEvent {
  title: string;
  start: string;
  end: string;
  status: 'offen' | 'bestätigt' | 'storniert';
}