import { Booking } from './../models/booking';
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  docData,
  addDoc
} from '@angular/fire/firestore';
import { collectionWithRequiredConverter } from './utils/firestore-converter.ts.js';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private firestore: Firestore = inject(Firestore);

  private get bookingCollection() {
    return collectionWithRequiredConverter<Booking>(this.firestore, 'bookings');
  }

  getAllBookings() {
    return collectionData(this.bookingCollection, { idField: 'id' });
  }

  getBookingById(id: string) {
    const bookingRef = doc(this.bookingCollection, id);
    return docData(bookingRef, { idField: 'id' });
  }

  addBooking(booking: Booking) {
    return from(addDoc(this.bookingCollection, booking));
  }

  updateBooking(id: string, booking: Partial<Booking>) {
    const bookingRef = doc(this.bookingCollection, id);
    return from(updateDoc(bookingRef, booking));
  }

  deleteBooking(id: string) {
    const bookingRef = doc(this.bookingCollection, id);
    return from(deleteDoc(bookingRef));
  }
}