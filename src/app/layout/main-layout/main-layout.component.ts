import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  currentUser: User | null = null;
  isAdmin$: Observable<boolean>;

  isLargeScreen = window.innerWidth > 768;
  isSidenavOpened = this.isLargeScreen;

  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  constructor(public router: Router) {
    this.isAdmin$ = this.authService.isAdmin$;
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isLargeScreen = window.innerWidth > 768;
    if (!this.isLargeScreen) {
      this.isSidenavOpened = false;
    }
  }

  get sidenavMode(): 'side' | 'over' {
    return this.isLargeScreen ? 'side' : 'over';
  }

  toggleSidebar() {
    this.isSidenavOpened = true;
    if (this.drawer && this.sidenavMode === 'side') {
      this.drawer.open();
    }
  }

  onContentClick() {
    if (this.isLargeScreen && this.isSidenavOpened) {
      this.isSidenavOpened = false;
    }
  }

  onSidenavStateChange(opened: boolean) {
    this.isSidenavOpened = opened;
  }

  onBackdropClick() {
    this.drawer.close();
  }

  isInAdminArea(): boolean {
    return this.router.url.startsWith('/admin');
  }

  logout() {
    this.authService.logout().then(() => {
      this.snackBar.open('🚪 Erfolgreich abgemeldet.', 'Schließen', {
        duration: 3000,
        verticalPosition: 'bottom',
      });
      this.router.navigate(['/']); // Optional: zur Startseite
    });
  }
}