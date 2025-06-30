import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import { combineLatest, map, switchMap, of, Observable } from 'rxjs';
import { Equipment } from '../models/equipment'; // ✅ Pfad anpassen

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private equipmentCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.equipmentCollection = collection(this.firestore, 'equipment');
  }

  getAllEquipmentWithBookings(): Observable<Equipment[]> {
  return collectionData(this.equipmentCollection, { idField: 'id' }).pipe(
    map((data) => data as Equipment[]),
    switchMap((equipmentList: Equipment[]) => {
      if (!equipmentList.length) return of([]);

      const combined = equipmentList.map((equipment) => {
        const bookingsRef = query(
          collection(this.firestore, 'bookings'),
          where('equipmentId', '==', equipment.id)
        );

        return collectionData(bookingsRef).pipe(
          map((bookings) => ({
            ...equipment,
            bookings: bookings.map((b: any) => ({
              title: 'Reservierung',
              start: b.startDate,
              end: b.endDate,
              status: b.status ?? 'offen', // 🟢 status mit übergeben
            })),
          }))
        );
      });

      return combineLatest(combined);
    })
  );
}

  getAllEquipmentOnly(): Observable<Equipment[]> {
    return collectionData(this.equipmentCollection, { idField: 'id' }) as Observable<Equipment[]>;
  }

  getEquipmentById(id: string): Observable<Equipment> {
    const docRef = doc(this.firestore, 'equipment', id);
    return docData(docRef, { idField: 'id' }) as Observable<Equipment>;
  }

  addEquipment(data: Omit<Equipment, 'id'>) {
    return addDoc(this.equipmentCollection, data);
  }

  updateEquipment(id: string, data: Partial<Equipment>) {
  const docRef = doc(this.firestore, 'equipment', id);
  return updateDoc(docRef, data); // NICHT mit 'pricing.day': xyz usw.
}

  deleteEquipment(id: string) {
    const docRef = doc(this.firestore, 'equipment', id);
    return deleteDoc(docRef);
  }
}