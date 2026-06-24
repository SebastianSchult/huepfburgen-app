import {
  getBookingDateRangeError,
  getTodayDateString,
  hasBookingDateOverlap,
} from './booking-validation';

describe('booking validation', () => {
  it('formats today as a date-only string', () => {
    expect(getTodayDateString(new Date('2026-06-24T10:15:00'))).toBe('2026-06-24');
  });

  it('rejects start dates in the past', () => {
    expect(getBookingDateRangeError('2026-06-23', '2026-06-24', '2026-06-24')).toBe(
      'start-in-past'
    );
  });

  it('rejects date ranges where the end is before the start', () => {
    expect(getBookingDateRangeError('2026-06-25', '2026-06-24', '2026-06-24')).toBe(
      'end-before-start'
    );
  });

  it('accepts same-day bookings', () => {
    expect(getBookingDateRangeError('2026-06-24', '2026-06-24', '2026-06-24')).toBeNull();
  });

  it('detects overlapping booking dates', () => {
    expect(
      hasBookingDateOverlap('2026-06-24', '2026-06-26', [
        {
          title: 'Existing booking',
          start: '2026-06-26',
          end: '2026-06-28',
          status: 'bestätigt',
        },
      ])
    ).toBeTrue();
  });

  it('allows non-overlapping booking dates', () => {
    expect(
      hasBookingDateOverlap('2026-06-24', '2026-06-26', [
        {
          title: 'Existing booking',
          start: '2026-06-27',
          end: '2026-06-28',
          status: 'bestätigt',
        },
      ])
    ).toBeFalse();
  });
});
