import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminComponent } from './admin.component';
import { BookingService } from '../../../services/booking.service';
import { EquipmentService } from '../../../services/equipment.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        {
          provide: BookingService,
          useValue: {
            getAllBookings: () => of([])
          }
        },
        {
          provide: EquipmentService,
          useValue: {
            getAllEquipmentOnly: () => of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
