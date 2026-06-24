import { Booking, BookingEvent } from '../../models/booking';

export type BookingDateRangeError =
  | 'invalid-date'
  | 'start-in-past'
  | 'end-before-start';

function parseDateOnly(value: string): Date | null {
  if (!value) return null;

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getTodayDateString(today: Date = new Date()): string {
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getBookingDateRangeError(
  startDate: string,
  endDate: string,
  todayDate = getTodayDateString()
): BookingDateRangeError | null {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  const today = parseDateOnly(todayDate);

  if (!start || !end || !today) {
    return 'invalid-date';
  }

  if (start < today) {
    return 'start-in-past';
  }

  if (end < start) {
    return 'end-before-start';
  }

  return null;
}

export function hasBookingDateOverlap(
  startDate: string,
  endDate: string,
  existingBookings: BookingEvent[]
): boolean {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end) {
    return false;
  }

  return existingBookings.some((booking) => {
    const existingStart = parseDateOnly(booking.start);
    const existingEnd = parseDateOnly(booking.end);

    if (!existingStart || !existingEnd) {
      return false;
    }

    return start <= existingEnd && end >= existingStart;
  });
}

export function hasConfirmedBookingConflict(
  booking: Booking,
  bookings: Booking[]
): boolean {
  if (!booking.equipmentId || !booking.startDate || !booking.endDate) {
    return false;
  }

  const existingBookings = bookings
    .filter((existingBooking) => existingBooking.id !== booking.id)
    .filter((existingBooking) => existingBooking.equipmentId === booking.equipmentId)
    .filter((existingBooking) => existingBooking.status === 'bestätigt')
    .map((existingBooking) => ({
      title: 'Confirmed booking',
      start: existingBooking.startDate,
      end: existingBooking.endDate,
      status: existingBooking.status ?? 'bestätigt',
    }));

  return hasBookingDateOverlap(booking.startDate, booking.endDate, existingBookings);
}
