import {
  getBookingDateRangeError,
  getTodayDateString,
  hasConfirmedBookingConflict,
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

  it('detects conflicts against confirmed bookings for the same equipment', () => {
    expect(
      hasConfirmedBookingConflict(
        {
          id: 'booking-2',
          equipmentId: 'equipment-1',
          createdBy: 'user-1',
          startDate: '2026-06-24',
          endDate: '2026-06-26',
          status: 'offen',
        },
        [
          {
            id: 'booking-1',
            equipmentId: 'equipment-1',
            createdBy: 'user-2',
            startDate: '2026-06-26',
            endDate: '2026-06-28',
            status: 'bestätigt',
          },
        ]
      )
    ).toBeTrue();
  });

  it('ignores cancelled bookings when checking admin confirmation conflicts', () => {
    expect(
      hasConfirmedBookingConflict(
        {
          id: 'booking-2',
          equipmentId: 'equipment-1',
          createdBy: 'user-1',
          startDate: '2026-06-24',
          endDate: '2026-06-26',
          status: 'offen',
        },
        [
          {
            id: 'booking-1',
            equipmentId: 'equipment-1',
            createdBy: 'user-2',
            startDate: '2026-06-26',
            endDate: '2026-06-28',
            status: 'storniert',
          },
        ]
      )
    ).toBeFalse();
  });
});
