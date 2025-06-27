import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc
} from '@angular/fire/firestore';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-edit-user',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIcon,
    RouterModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  uid = '';
  email = '';
  role = 'user';
  loading = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore
  ) {}

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    if (!this.uid) {
      this.message = '❌ Keine Benutzer-ID gefunden.';
      return;
    }

    try {
      const userRef = doc(this.firestore, `users/${this.uid}`);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        this.message = '❌ Benutzer nicht gefunden.';
        return;
      }
      const user = userSnap.data();
      this.email = user['email'];
      this.role = user['role'];
    } catch (error) {
      this.message = '❌ Fehler beim Laden des Benutzers.';
    }
  }

  async saveChanges() {
    this.loading = true;
    this.message = '';
    try {
      const userRef = doc(this.firestore, `users/${this.uid}`);
      await updateDoc(userRef, {
        email: this.email,
        role: this.role
      });
      this.message = '✅ Änderungen gespeichert.';
      setTimeout(() => this.router.navigate(['/admin/users']), 1500);
    } catch (err) {
      this.message = '❌ Fehler beim Speichern.';
    } finally {
      this.loading = false;
    }
  }
}