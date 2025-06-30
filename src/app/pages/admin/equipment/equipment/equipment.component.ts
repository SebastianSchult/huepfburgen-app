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

interface EquipmentItem extends Equipment {
  bookings?: { title: string; start: string; end: string }[];
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
  private dialog = inject(MatDialog);

  equipmentList = signal<EquipmentItem[]>([]);
  brokenImages = new Set<string>();

  private _loadEffect = effect(() => {
    this.equipmentService.getAllEquipmentWithBookings().subscribe({
      next: (equipments) => {
        const result: EquipmentItem[] = equipments.map((item) => ({
          ...item,
          calendarOptions: {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
            events: item.bookings ?? [],
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
        });
      }
    });
  }

  deleteEquipment(id: string) {
    if (confirm('Möchtest du dieses Equipment wirklich löschen?')) {
      this.equipmentService.deleteEquipment(id).then(() => {
        console.log('Equipment gelöscht');
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
}