import { BookingEvent } from './../../../../models/booking';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EquipmentService } from '../../../../services/equipment.service';
import { Equipment } from '../../../../models/equipment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EquipmentDialogComponent } from '../equipment-dialog/equipment-dialog.component';
import { BookingDialogComponent } from '../../../../features/booking/booking-dialog/booking-dialog.component';
import { BookingService } from '../../../../services/booking.service';
interface EquipmentItem extends Equipment {
  bookings?: BookingEvent[];
  calendarOptions: CalendarOptions;
  
}

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    FullCalendarModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent {
  private equipmentService = inject(EquipmentService);
  private bookingService = inject(BookingService);
  private dialog = inject(MatDialog);

  equipmentList = signal<EquipmentItem[]>([]);
  brokenImages = new Set<string>();

  // Ladefunktion extrahiert
  private loadEquipment() {
  this.equipmentService.getAllEquipmentWithBookings().subscribe({
    next: (equipments) => {
      const result: EquipmentItem[] = equipments.map((item) => ({
        ...item,
        calendarOptions: {
          plugins: [dayGridPlugin],
          initialView: 'dayGridMonth',
          events: (item.bookings ?? []).map((booking) => {
            // Enddatum um 1 Tag erhöhen, damit FullCalendar es inklusiv anzeigt
            const endDate = new Date(booking.end);
            endDate.setDate(endDate.getDate() + 1);

            return {
              title: `${booking.status === 'bestätigt' ? '✔' : booking.status === 'storniert' ? '✖' : '⏳'} ${booking.title ?? 'Buchung'} (${booking.start.substring(11, 16)}–${booking.end.substring(11, 16)})`,
              start: booking.start,
              end: endDate.toISOString().substring(0, 10),
              backgroundColor:
                booking.status === 'bestätigt' ? '#4caf50' :
                booking.status === 'storniert' ? '#f44336' :
                '#ff9800',
              borderColor:
                booking.status === 'bestätigt' ? '#388e3c' :
                booking.status === 'storniert' ? '#d32f2f' :
                '#f57c00',
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
    error: (err) => console.error('Fehler beim Laden der Daten:', err),
  });
}

  // Effekt beim Start
  private _loadEffect = effect(() => {
    this.loadEquipment();
  });

  readonly availableEquipment = computed(() =>
    this.equipmentList().filter((eq) => eq.active)
  );

  openAddDialog() {
    const dialogRef = this.dialog.open(EquipmentDialogComponent, {
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.equipmentService.addEquipment(result).then(() => {
          console.log('Neues Equipment erfolgreich hinzugefügt');
          this.loadEquipment(); // Reload nach dem Hinzufügen
        });
      }
    });
  }

  openEditDialog(equipment: Equipment) {
    const hasNestedPricing =
      typeof equipment.pricing === 'object' && equipment.pricing !== null;

    const fixedEquipment: Equipment = {
      ...equipment,
      pricing: hasNestedPricing
        ? equipment.pricing
        : {
            day: (equipment as any)['pricing.day'] ?? 0,
            weekend: (equipment as any)['pricing.weekend'] ?? 0,
            withDelivery: (equipment as any)['pricing.withDelivery'] ?? 0,
          },
    };

    const dialogRef = this.dialog.open(EquipmentDialogComponent, {
      data: { mode: 'edit', equipment: fixedEquipment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.equipmentService.updateEquipment(equipment.id, result).then(() => {
          console.log('Equipment aktualisiert');
          this.loadEquipment(); // Reload nach dem Bearbeiten
        });
      }
    });
  }

  deleteEquipment(id: string) {
    if (confirm('Möchtest du dieses Equipment wirklich löschen?')) {
      this.equipmentService.deleteEquipment(id).then(() => {
        console.log('Equipment gelöscht');
        this.loadEquipment(); // Reload nach dem Löschen
      });
    }
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

  openBookingDialog(equipmentId: string) {
    const equipmentList = this.equipmentList();
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      data: {
        mode: 'add',
        equipmentId,
        equipmentList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Neue Buchung gespeichert:', result);
        this.loadEquipment(); // Kalenderdaten neu laden
      }
    });
  }
}
