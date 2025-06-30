import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EquipmentService } from '../../../../services/equipment.service';

interface EquipmentItem {
  id: string;
  name: string;
  status: string;
  bookings: { title: string; start: string; end: string }[];
  calendarOptions: CalendarOptions;
}

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, FullCalendarModule],
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent {
  private equipmentService = inject(EquipmentService);

  // ✅ Hauptsignal für Equipment-List
  equipmentList = signal<EquipmentItem[]>([]);

  // ✅ Effekt – wird automatisch getriggert und aufgeräumt
  private _loadEffect = effect(() => {
    this.equipmentService.getAllEquipmentWithBookings().subscribe({
      next: (equipments) => {
        const result = equipments.map((item) => ({
          ...item,
          calendarOptions: {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
            events: item.bookings,
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

  // ✅ Optional: computed Signal für gefilterte oder gruppierte Darstellung
  readonly availableEquipment = computed(() =>
    this.equipmentList().filter((eq) => eq.status === 'verfügbar')
  );
}