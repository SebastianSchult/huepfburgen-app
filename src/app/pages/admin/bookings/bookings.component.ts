import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EquipmentService } from '../../../services/equipment.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class AdminBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private equipmentService = inject(EquipmentService);
  private snackBar = inject(MatSnackBar);

  bookingsWithEquipmentName: (Booking & { equipmentName: string })[] = [];
  
displayedColumns = ['equipmentId', 'bookedFor', 'createdBy', 'startDate', 'endDate', 'status', 'actions'];
  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    combineLatest([
      this.bookingService.getAllBookings(),
      this.equipmentService.getAllEquipmentOnly()
    ]).subscribe({
      next: ([bookings, equipments]) => {
        // Filter für offene Buchungen
        const offeneBuchungen = bookings.filter(b => b.status === 'offen');

        this.bookingsWithEquipmentName = offeneBuchungen.map(b => {
          const eq = equipments.find(e => e.id === b.equipmentId);
          return {
            ...b,
            equipmentName: eq ? eq.name : b.equipmentId
          };
        });
      },
      error: (err) => console.error('Fehler beim Laden der Buchungen:', err),
    });
  }

  approveBooking(id: string) {
    this.bookingService.updateBooking(id, { status: 'bestätigt' }).subscribe(() => {
      this.snackBar.open('Buchung bestätigt', 'OK', { duration: 3000 });
      this.loadBookings();
    });
  }

  rejectBooking(id: string) {
    this.bookingService.updateBooking(id, { status: 'storniert' }).subscribe(() => {
      this.snackBar.open('Buchung abgelehnt', 'OK', { duration: 3000 });
      this.loadBookings();
    });
  }
}