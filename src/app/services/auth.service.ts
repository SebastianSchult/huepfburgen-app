import { Injectable, inject, NgZone, runInInjectionContext } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Injector } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private zone = inject(NgZone);

  private injector = inject(Injector); // ✅ füge das hinzu

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      runInInjectionContext(this.injector, async () => {
        this.zone.run(() => this.currentUserSubject.next(user));
        if (user) {
          await this.checkAdminStatus(user.uid);
        } else {
          this.zone.run(() => this.isAdminSubject.next(false));
        }
      });
    });
  }

  async login(email: string, password: string) {
    return runInInjectionContext(this.injector, async () => {
      try {
        const cred = await signInWithEmailAndPassword(this.auth, email, password);
        await this.checkAdminStatus(cred.user.uid);

        const isAdmin = this.isAdminSubject.getValue();
        this.zone.run(() => {
          this.router.navigate([isAdmin ? '/admin' : '/']);
        });
      } catch (error) {
        throw error;
      }
    });
  }

  private async checkAdminStatus(uid: string) {
  await runInInjectionContext(this.injector, async () => {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userDocRef);
    const isAdmin = userSnap.exists() && userSnap.data()['role'] === 'admin';
    this.zone.run(() => this.isAdminSubject.next(isAdmin));
  });
}

  async createUserProfile(uid: string, email: string, role: string = 'user') {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, { email, role }, { merge: true });
  }

  logout() {
    return signOut(this.auth).then(() => {
      this.currentUserSubject.next(null);
      this.isAdminSubject.next(false);
      this.router.navigate(['/']);
    });
  }
}