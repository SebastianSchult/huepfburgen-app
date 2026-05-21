import {
  Injectable,
  inject,
  Injector,
  NgZone,
  runInInjectionContext,
} from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private zone = inject(NgZone);

  private injector = inject(Injector);

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
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      if (!normalizedEmail || !normalizedPassword) {
        throw new Error('Bitte E-Mail und Passwort eingeben.');
      }

      try {
        const cred = await signInWithEmailAndPassword(this.auth, normalizedEmail, normalizedPassword);
        await this.checkAdminStatus(cred.user.uid);

        const isAdmin = this.isAdminSubject.getValue();
        this.zone.run(() => {
          this.router.navigate([isAdmin ? '/admin' : '/']);
        });
      } catch (error) {
        throw new Error(this.mapAuthErrorMessage(error));
      }
    });
  }

  private mapAuthErrorMessage(error: unknown): string {
    const authError = error as { code?: string } | undefined;
    const code = authError?.code ?? 'auth/unbekannt';

    switch (code) {
      case 'auth/invalid-email':
        return 'Die E-Mail-Adresse ist ungültig.';
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-Mail oder Passwort ist falsch.';
      case 'auth/too-many-requests':
        return 'Zu viele Login-Versuche. Bitte warte kurz und versuche es erneut.';
      case 'auth/network-request-failed':
        return 'Netzwerkfehler beim Login. Bitte Internetverbindung prüfen.';
      case 'auth/operation-not-allowed':
        return 'Login per E-Mail/Passwort ist im Firebase-Projekt nicht aktiviert.';
      default:
        return `Login fehlgeschlagen (${code}).`;
    }
  }

  private async checkAdminStatus(uid: string) {
    await runInInjectionContext(this.injector, async () => {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.data() as { role?: string } | undefined;
      const isAdmin = userSnap.exists() && userData?.role === 'admin';
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
