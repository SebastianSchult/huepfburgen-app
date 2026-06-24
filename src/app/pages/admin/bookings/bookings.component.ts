// src/app/pages/admin/bookings/bookings.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking';
import { EquipmentService } from '../../../services/equipment.service';
import { UserService } from '../../../services/user/user.service';
import { combineLatest } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { hasConfirmedBookingConflict } from '../../../features/booking/booking-validation';

interface BookingRow extends Booking {
  equipmentName: string;
  createdByEmail: string;
  bookedFor?: string;
}

type BookingStatusFilter = 'all' | 'offen' | 'bestätigt' | 'storniert';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class AdminBookingsComponent implements OnInit {
  private bookingService   = inject(BookingService);
  private equipmentService = inject(EquipmentService);
  private userService      = inject(UserService);
  private snackBar         = inject(MatSnackBar);

  bookings: BookingRow[] = [];            // offen
  bookingsConfirmed: BookingRow[] = [];   // bestätigt
  bookingsCanceled: BookingRow[] = [];    // storniert
  equipmentFilterOptions: Array<{ id: string; name: string }> = [];
  statusFilter: BookingStatusFilter = 'all';
  equipmentFilter = 'all';
  dateFromFilter = '';
  dateToFilter = '';

  private allBookings: BookingRow[] = [];

  // Spalten-Konfiguration
  displayedColumns = [
  'equipmentName',
  'createdByEmail',
  'bookedFor',
  'locationOverride',
  'startDate',
  'endDate',
  'status',
  'actions'
];

displayedColumnsNoActions = [
  'equipmentName',
  'createdByEmail',
  'bookedFor',
  'locationOverride',
  'startDate',
  'endDate',
  'status'
];

  ngOnInit() {
    this.loadBookings();
  }

  private loadBookings() {
    combineLatest([
      this.bookingService.getAllBookings(),
      this.equipmentService.getAllEquipmentOnly(),
      this.userService.getAllUsers()
    ]).subscribe({
      next: ([rawBookings, equips, users]) => {
        const userMap = new Map(users.map(u => [u.id, u.email]));
        this.equipmentFilterOptions = equips
          .map((equipment) => ({ id: equipment.id, name: equipment.name }))
          .sort((a, b) => a.name.localeCompare(b.name));

        this.allBookings = rawBookings.map(b => {
          const eq = equips.find(e => e.id === b.equipmentId);
          return {
            ...b,
            equipmentName: eq?.name ?? '–',
            createdByEmail: userMap.get(b.createdBy) ?? '–',
            bookedFor: (b as any).bookedFor ?? '–'
          };
        });
        this.applyFilters();
      },
      error: err => console.error('Fehler beim Laden der Buchungen:', err)
    });
  }

  applyFilters() {
    const filteredRows = this.allBookings.filter((booking) => {
      const matchesStatus = this.statusFilter === 'all' || booking.status === this.statusFilter;
      const matchesEquipment = this.equipmentFilter === 'all' || booking.equipmentId === this.equipmentFilter;
      const matchesDateRange = this.matchesDateRange(booking);

      return matchesStatus && matchesEquipment && matchesDateRange;
    });

    this.bookings          = filteredRows.filter(b => b.status === 'offen');
    this.bookingsConfirmed = filteredRows.filter(b => b.status === 'bestätigt');
    this.bookingsCanceled  = filteredRows.filter(b => b.status === 'storniert');
  }

  resetFilters() {
    this.statusFilter = 'all';
    this.equipmentFilter = 'all';
    this.dateFromFilter = '';
    this.dateToFilter = '';
    this.applyFilters();
  }

  isStatusSectionVisible(status: Exclude<BookingStatusFilter, 'all'>): boolean {
    return this.statusFilter === 'all' || this.statusFilter === status;
  }

  private matchesDateRange(booking: BookingRow): boolean {
    if (!this.dateFromFilter && !this.dateToFilter) {
      return true;
    }

    const bookingStart = this.parseDateOnly(booking.startDate);
    const bookingEnd = this.parseDateOnly(booking.endDate);
    const filterStart = this.dateFromFilter ? this.parseDateOnly(this.dateFromFilter) : null;
    const filterEnd = this.dateToFilter ? this.parseDateOnly(this.dateToFilter) : null;

    if (!bookingStart || !bookingEnd) {
      return false;
    }

    if (filterStart && bookingEnd < filterStart) {
      return false;
    }

    if (filterEnd && bookingStart > filterEnd) {
      return false;
    }

    return true;
  }

  private parseDateOnly(value: string): Date | null {
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  approveBooking(id: string) {
    const booking = this.bookings.find((item) => item.id === id);

    if (!booking) {
      this.snackBar.open('Buchung nicht gefunden', 'OK', { duration: 3000 });
      return;
    }

    if (hasConfirmedBookingConflict(booking, this.bookingsConfirmed)) {
      this.snackBar.open('Buchung kollidiert mit einer bereits bestätigten Buchung.', 'OK', {
        duration: 5000
      });
      return;
    }

    this.bookingService.updateBooking(id, { status: 'bestätigt' })
      .subscribe(() => {
        this.snackBar.open('Buchung bestätigt', 'OK', { duration: 3000 });
        this.loadBookings();
      });
  }

  rejectBooking(id: string) {
    this.bookingService.updateBooking(id, { status: 'storniert' })
      .subscribe(() => {
        this.snackBar.open('Buchung storniert', 'OK', { duration: 3000 });
        this.loadBookings();
      });
  }
}
