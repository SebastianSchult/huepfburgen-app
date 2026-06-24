import { TestBed } from '@angular/core/testing';

import { BookingService } from './booking.service';
import { provideAppTestDependencies } from '../testing/test-providers';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: provideAppTestDependencies(),
    });
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
