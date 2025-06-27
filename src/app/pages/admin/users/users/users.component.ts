import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collectionData, collection, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { User as FirebaseUser } from '@angular/fire/auth';

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
    MatSnackBarModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private firestore = inject(Firestore);
  private router = inject(Router);
  private authService = inject(AuthService);
  private zone = inject(NgZone);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['email', 'role', 'actions'];
  users$: Observable<User[]>;
  currentUserUid: string | null = null;

  constructor() {
    const usersRef = collection(this.firestore, 'users');
    this.users$ = collectionData(usersRef, { idField: 'uid' }) as Observable<User[]>;

    this.authService.currentUser$.subscribe((user: FirebaseUser | null) => {
      this.zone.run(() => {
        this.currentUserUid = user?.uid ?? null;
      });
    });
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

    this.snackBar.open('Benutzer erfolgreich gelöscht.', 'OK', {
      duration: 3000,
    });
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    this.snackBar.open('Fehler beim Löschen des Benutzers.', 'Schließen', {
      duration: 5000,
    });
  }
}

  isCurrentUser(uid: string | undefined): boolean {
    return !!uid && uid === this.currentUserUid;
  }
}