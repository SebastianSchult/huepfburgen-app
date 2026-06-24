import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserComponent } from './new-user.component';
import { provideAppTestDependencies } from '../../../../testing/test-providers';

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUserComponent],
      providers: provideAppTestDependencies(),
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
