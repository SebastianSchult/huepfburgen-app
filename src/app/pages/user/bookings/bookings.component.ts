import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

import { EquipmentService } from '../../../services/equipment.service';
import { Equipment } from '../../../models/equipment';
import { BookingEvent } from '../../../models/booking';
import { BookingDialogComponent } from '../../../features/booking/booking-dialog/booking-dialog.component';

interface EquipmentItem extends Equipment {
  bookings?: BookingEvent[];
  calendarOptions: CalendarOptions;
}

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FullCalendarModule,
  ],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class UserBookingsComponent {
  private equipmentService = inject(EquipmentService);
  private dialog = inject(MatDialog);

  equipmentList = signal<EquipmentItem[]>([]);
  brokenImages = new Set<string>();

  readonly availableEquipment = computed(() =>
    this.equipmentList().filter((equipment) => equipment.active)
  );

  private loadEquipment() {
    this.equipmentService.getAllEquipmentWithBookings().subscribe({
      next: (equipments) => {
        const result: EquipmentItem[] = equipments.map((item) => ({
          ...item,
          calendarOptions: {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
            events: (item.bookings ?? []).map((booking) => {
              const endDate = new Date(booking.end);
              endDate.setDate(endDate.getDate() + 1);

              return {
                title: `${booking.status === 'bestätigt' ? 'Belegt' : booking.status === 'storniert' ? 'Storniert' : 'Angefragt'}`,
                start: booking.start,
                end: endDate.toISOString().substring(0, 10),
                backgroundColor:
                  booking.status === 'bestätigt'
                    ? '#4caf50'
                    : booking.status === 'storniert'
                      ? '#f44336'
                      : '#ff9800',
                borderColor:
                  booking.status === 'bestätigt'
                    ? '#388e3c'
                    : booking.status === 'storniert'
                      ? '#d32f2f'
                      : '#f57c00',
                textColor: '#fff',
              };
            }),
            headerToolbar: {
              left: 'title',
              center: '',
              right: 'prev,next',
            },
            height: 300,
          },
        }));

        this.equipmentList.set(result);
      },
      error: (error) => console.error('Fehler beim Laden des Equipments:', error),
    });
  }

  private readonly loadEffect = effect(() => {
    this.loadEquipment();
  });

  openBookingDialog(equipment: Equipment) {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      data: {
        mode: 'add',
        equipmentId: equipment.id,
        equipmentList: this.availableEquipment(),
        isUserFlow: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEquipment();
      }
    });
  }

  isValidImage(url: string | null | undefined): boolean {
    if (!url) return false;
    const trimmed = url.trim();
    return trimmed !== '' && trimmed !== 'undefined' && trimmed !== 'null';
  }

  isImageValid(item: Equipment): boolean {
    return this.isValidImage(item.imageUrl) && !this.brokenImages.has(item.id);
  }

  onImageError(item: Equipment) {
    this.brokenImages.add(item.id);
  }
}
