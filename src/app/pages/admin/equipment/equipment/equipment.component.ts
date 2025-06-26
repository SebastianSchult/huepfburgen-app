import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent {
  equipmentList = [
    { name: 'Hüpfburg Dino', status: 'verfügbar' },
    { name: 'Hüpfburg Schloss', status: 'reserviert' },
  ];
}