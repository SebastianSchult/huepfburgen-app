import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutComponent } from './main-layout.component';
import { provideAppTestDependencies } from '../../testing/test-providers';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        ...provideAppTestDependencies(),
        {
          provide: AuthService,
          useValue: {
            currentUser$: of(null),
            isAdmin$: of(false),
            logout: async () => undefined,
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
