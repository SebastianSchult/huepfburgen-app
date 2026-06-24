import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EquipmentComponent } from './equipment.component';
import { BookingService } from '../../../../services/booking.service';
import { EquipmentService } from '../../../../services/equipment.service';
import { provideAppTestDependencies } from '../../../../testing/test-providers';

describe('EquipmentComponent', () => {
  let component: EquipmentComponent;
  let fixture: ComponentFixture<EquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentComponent],
      providers: [
        ...provideAppTestDependencies(),
        {
          provide: EquipmentService,
          useValue: {
            getAllEquipmentWithBookings: () => of([]),
            getAllEquipmentOnly: () => of([]),
          },
        },
        {
          provide: BookingService,
          useValue: {},
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
