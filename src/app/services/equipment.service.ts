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
  CollectionReference
} from '@angular/fire/firestore';
import { combineLatest, map, switchMap, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private equipmentCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.equipmentCollection = collection(this.firestore, 'equipment');
  }

  // ✅ Bestehende Methode: Equipment + Buchungen
  getAllEquipmentWithBookings(): Observable<any[]> {
    return collectionData(this.equipmentCollection, { idField: 'id' }).pipe(
      switchMap((equipmentList: any[]) => {
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
              })),
            }))
          );
        });

        return combineLatest(combined);
      })
    );
  }

  // 🔍 Nur Equipment (ohne Buchungen)
  getAllEquipmentOnly(): Observable<any[]> {
    return collectionData(this.equipmentCollection, { idField: 'id' });
  }

  // 📄 Einzelnes Equipment lesen
  getEquipmentById(id: string): Observable<any> {
    const docRef = doc(this.firestore, 'equipment', id);
    return docData(docRef, { idField: 'id' });
  }

  // 🆕 Neues Equipment anlegen
  addEquipment(data: { name: string; status: string }) {
    return addDoc(this.equipmentCollection, data);
  }

  // ✏️ Vorhandenes Equipment aktualisieren
  updateEquipment(id: string, data: Partial<{ name: string; status: string }>) {
    const docRef = doc(this.firestore, 'equipment', id);
    return updateDoc(docRef, data);
  }

  // ❌ Equipment löschen
  deleteEquipment(id: string) {
    const docRef = doc(this.firestore, 'equipment', id);
    return deleteDoc(docRef);
  }
}