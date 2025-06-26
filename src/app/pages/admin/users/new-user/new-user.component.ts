import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-new-user',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './new-user.component.html',
})
export class NewUserComponent {
  email = '';
  role = 'user';
  loading = false;
  message = '';
  error = '';

  constructor(private firestore: Firestore, private router: Router) {}

  async createUserPlaceholder() {
    this.loading = true;
    this.message = '';
    this.error = '';

    if (!this.email.includes('@')) {
      this.error = 'Bitte eine gültige E-Mail-Adresse angeben.';
      this.loading = false;
      return;
    }

    try {
      const usersRef = collection(this.firestore, 'users');
      await addDoc(usersRef, {
        email: this.email.trim().toLowerCase(),
        role: this.role,
      });
      this.message = '✅ Benutzer erfolgreich erstellt.';
      this.email = '';
      this.role = 'user';

      // Optional: nach 1 Sekunde zurück zur Übersicht
      setTimeout(() => this.router.navigate(['/admin/users']), 1000);
    } catch (err) {
      this.error = '❌ Fehler: Benutzer konnte nicht angelegt werden.';
    } finally {
      this.loading = false;
    }
  }
}