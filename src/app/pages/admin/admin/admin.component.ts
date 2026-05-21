import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { combineLatest } from 'rxjs';
import { Booking } from '../../../models/booking';
import { BookingService } from '../../../services/booking.service';
import { EquipmentService } from '../../../services/equipment.service';

interface UpcomingBooking extends Booking {
  equipmentName: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private bookingService = inject(BookingService);
  private equipmentService = inject(EquipmentService);

  upcomingBookings: UpcomingBooking[] = [];

  ngOnInit(): void {
    this.loadUpcomingBookings();
  }

  private loadUpcomingBookings(): void {
    combineLatest([
      this.bookingService.getAllBookings(),
      this.equipmentService.getAllEquipmentOnly()
    ]).subscribe({
      next: ([bookings, equipment]) => {
        const now = Date.now();

        this.upcomingBookings = bookings
          .filter((booking) => booking.status === 'bestätigt' && new Date(booking.startDate).getTime() >= now)
          .map((booking) => {
            const matchingEquipment = equipment.find((item) => item.id === booking.equipmentId);

            return {
              ...booking,
              equipmentName: matchingEquipment?.name ?? 'Unbekanntes Equipment'
            };
          })
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 6);
      },
      error: (error) => {
        console.error('Fehler beim Laden der bevorstehenden Vermietungen:', error);
        this.upcomingBookings = [];
      }
    });
  }
}
