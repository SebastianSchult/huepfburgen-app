import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collectionData, collection, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface User {
  email: string;
  role: string;
  uid?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  displayedColumns: string[] = ['email', 'role', 'actions'];
  users$: Observable<User[]>;

  constructor(private router: Router, private firestore: Firestore) {
    const usersRef = collection(this.firestore, 'users');
    this.users$ = collectionData(usersRef, { idField: 'uid' }) as Observable<User[]>;
  }

  navigateToNewUser() {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(uid?: string) {
    if (uid) {
      this.router.navigate(['/admin/users/edit', uid]);
    }
  }

  async deleteUser(uid: string) {
    if (!uid) return;

    const confirmDelete = confirm('Benutzer wirklich löschen?');
    if (!confirmDelete) return;

    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await deleteDoc(userDocRef);
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen des Benutzers.');
    }
  }
}