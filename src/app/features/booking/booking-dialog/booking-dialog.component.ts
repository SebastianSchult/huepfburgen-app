import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Booking } from '../../../models/booking';
import { Equipment } from '../../../models/equipment';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './booking-dialog.component.html',
})
export class BookingDialogComponent implements OnInit {
  form: FormGroup;
  equipmentOptions: Equipment[];
  allBookings: Booking[] = [];

  private bookingService = inject(BookingService);

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'add' | 'edit'; booking?: Booking; equipmentList: Equipment[] }
  ) {
    this.equipmentOptions = data.equipmentList;

    this.form = this.fb.group({
      equipmentId: [data.booking?.equipmentId ?? '', Validators.required],
      startDate: [data.booking?.startDate ?? '', Validators.required],
      endDate: [data.booking?.endDate ?? '', Validators.required],
      status: [data.booking?.status ?? 'offen', Validators.required],
    });
  }

  ngOnInit(): void {
    const equipmentId = this.data.booking?.equipmentId ?? this.form.get('equipmentId')?.value;
    if (equipmentId) {
      this.bookingService.getAllBookings().subscribe((bookings) => {
        this.allBookings = bookings.filter(b => b.equipmentId === equipmentId);
      });
    }

    // Optional: Dynamisch bei Auswahländerung nachladen
    this.form.get('equipmentId')?.valueChanges.subscribe(id => {
      this.bookingService.getAllBookings().subscribe((bookings) => {
        this.allBookings = bookings.filter(b => b.equipmentId === id);
      });
    });
  }

  save() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const bookingData: Booking = {
    ...this.form.value,
    createdBy: 'test-user-123', // Ersetze das mit aktueller Nutzer-ID!
  };

  // Überprüfe Überschneidungen
  const existingBookings = this.data.equipmentList
    .find(eq => eq.id === bookingData.equipmentId)?.bookings ?? [];

  const newStart = new Date(bookingData.startDate);
  const newEnd = new Date(bookingData.endDate);

  const overlaps = existingBookings.some(b => {
    const existingStart = new Date(b.start);
    const existingEnd = new Date(b.end);
    return newStart <= existingEnd && newEnd >= existingStart;
  });

  if (overlaps) {
    this.snackBar.open('Buchung überschneidet sich mit bestehender!', 'OK', {
      duration: 4000,
    });
    return;
  }

  if (this.data.mode === 'add') {
    this.bookingService.addBooking(bookingData).subscribe({
      next: () => {
        this.snackBar.open('Buchung erstellt', 'OK', { duration: 3000 });
        this.dialogRef.close(true); // signalisiert Erfolg
      },
      error: (err) => {
        this.snackBar.open('Fehler beim Erstellen der Buchung', 'OK', { duration: 3000 });
        console.error(err);
      }
    });
  } else if (this.data.mode === 'edit' && this.data.booking?.id) {
    this.bookingService.updateBooking(this.data.booking.id, bookingData).subscribe({
      next: () => {
        this.snackBar.open('Buchung aktualisiert', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open('Fehler beim Aktualisieren der Buchung', 'OK', { duration: 3000 });
        console.error(err);
      }
    });
  }
}

  cancel() {
    this.dialogRef.close(null);
  }
}