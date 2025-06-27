import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, FullCalendarModule],
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent implements OnInit {
  equipmentList: {
    id: string;
    name: string;
    status: string;
    bookings: any[];
    calendarOptions: CalendarOptions;
  }[] = [];

  ngOnInit() {
    const baseList = [
      {
        id: 'abc123',
        name: 'Hüpfburg Dino',
        status: 'verfügbar',
        bookings: [
          { title: 'Reserviert', start: '2025-07-12', end: '2025-07-14' }
        ]
      },
      {
        id: 'def456',
        name: 'Hüpfburg Schloss',
        status: 'reserviert',
        bookings: [
          { title: 'Reserviert', start: '2025-07-20', end: '2025-07-22' }
        ]
      }
    ];

    // Pro Element die Kalenderoptionen berechnen
    this.equipmentList = baseList.map(item => ({
      ...item,
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: item.bookings,
        headerToolbar: {
          left: 'title',
          center: '',
          right: 'prev,next'
        },
        height: 300
      }
    }));
  }
}