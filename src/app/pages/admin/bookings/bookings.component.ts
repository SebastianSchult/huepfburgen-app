// src/app/pages/admin/bookings/bookings.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking';
import { EquipmentService } from '../../../services/equipment.service';
import { UserService } from '../../../services/user/user.service';
import { combineLatest } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

interface BookingRow extends Booking {
  equipmentName: string;
  createdByEmail: string;
  bookedFor?: string;
}

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class AdminBookingsComponent implements OnInit {
  private bookingService   = inject(BookingService);
  private equipmentService = inject(EquipmentService);
  private userService      = inject(UserService);
  private snackBar         = inject(MatSnackBar);

  // jeweils nur offene
  bookings: BookingRow[] = [];
  // bestätigte ohne Aktionen
  bookingsConfirmed: BookingRow[] = [];
  // stornierte ohne Aktionen
  bookingsCanceled: BookingRow[] = [];

  // Spalten für offene (mit Aktionen)
  displayedColumns = [
    'equipmentName',
    'createdByEmail',
    'bookedFor',
    'startDate',
    'endDate',
    'status',
    'actions'
  ];
  // Spalten für bestätigte/stornierte (ohne Aktionen)
  displayedColumnsNoActions = [
    'equipmentName',
    'createdByEmail',
    'bookedFor',
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
      next: ([rawBookings, equipments, users]) => {
        const userMap = new Map<string,string>(users.map(u => [u.id, u.email]));
        // ganzes Array transformieren
        const allRows: BookingRow[] = rawBookings.map(b => {
          const eq = equipments.find(e => e.id === b.equipmentId);
          return {
            ...b,
            equipmentName: eq?.name ?? '–',
            createdByEmail: userMap.get(b.createdBy) ?? '–',
            bookedFor: (b as any).bookedFor ?? '–'
          };
        });
        // nach Status aufteilen
        this.bookings          = allRows.filter(b => b.status === 'offen');
        this.bookingsConfirmed = allRows.filter(b => b.status === 'bestätigt');
        this.bookingsCanceled  = allRows.filter(b => b.status === 'storniert');
      },
      error: err => console.error('Fehler beim Laden der Buchungen:', err)
    });
  }

  approveBooking(id: string) {
    this.bookingService.updateBooking(id, { status: 'bestätigt' })
      .subscribe(() => {
        this.snackBar.open('Buchung bestätigt', 'OK', { duration: 3000 });
        this.loadBookings();
      });
  }

  rejectBooking(id: string) {
    this.bookingService.updateBooking(id, { status: 'storniert' })
      .subscribe(() => {
        this.snackBar.open('Buchung abgelehnt', 'OK', { duration: 3000 });
        this.loadBookings();
      });
  }
}