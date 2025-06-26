import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = '';
  password = '';
  message = '';
  loading = false;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async register() {
    this.message = '';
    this.loading = true;

    try {
      // 🔍 Prüfe, ob E-Mail in Firestore-Platzhalter vorhanden ist
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', this.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        this.message = '❌ Registrierung nicht erlaubt. Bitte kontaktiere den Administrator.';
        return;
      }

      const data = querySnapshot.docs[0].data();
      const role = data['role'] || 'user';

      // ✅ Firebase Auth Benutzerkonto anlegen
      const cred = await createUserWithEmailAndPassword(this.auth, this.email, this.password);

      // 🔄 Dokument mit UID als ID neu setzen
      const userDocRef = doc(this.firestore, `users/${cred.user.uid}`);
      await setDoc(userDocRef, {
        email: this.email,
        role,
        uid: cred.user.uid
      });

      this.message = '✅ Registrierung erfolgreich. Weiterleitung...';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    } catch (error: any) {
      this.message = `❌ Fehler: ${error.message}`;
    } finally {
      this.loading = false;
    }
  }
}