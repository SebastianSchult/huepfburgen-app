import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            currentUser$: undefined,
            isAdmin$: undefined,
            waitForAuthReady: async () => undefined,
            isAuthenticated: async () => false,
            login: async () => undefined,
            logout: async () => undefined,
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
