import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);

  /** Gibt alle User-Dokumente zurück (mit { idField: 'id' }) */
  getAllUsers(): Observable<User[]> {
    const usersCol = collection(this.firestore, 'users');
    return collectionData(usersCol, { idField: 'id' }) as Observable<User[]>;
  }
}