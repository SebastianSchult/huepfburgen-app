import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUserSubject.next(user);
      if (user) {
        await this.checkAdminStatus(user.uid);
      } else {
        this.isAdminSubject.next(false);
      }
    });
  }

  async login(email: string, password: string) {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      await this.checkAdminStatus(cred.user.uid);
      this.router.navigate(['/']); // evtl. '/admin' bei Bedarf
    } catch (error) {
      throw error;
    }
  }

  logout() {
    return signOut(this.auth).then(() => {
      this.currentUserSubject.next(null);
      this.isAdminSubject.next(false);
      this.router.navigate(['/login']);
    });
  }

  async checkAdminStatus(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userDocRef);
    const isAdmin = userSnap.exists() && userSnap.data()['role'] === 'admin';
    this.isAdminSubject.next(isAdmin);
  }
}