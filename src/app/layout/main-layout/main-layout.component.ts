import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service'; // ggf. Pfad anpassen

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
    MatIconModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  isLargeScreen = window.innerWidth > 768;
  isSidenavOpened = this.isLargeScreen;

  private authService = inject(AuthService);
  isAdmin: boolean = false;

  constructor(public router: Router) {
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
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
    console.log('toggleSidebar clicked, current state:', this.isSidenavOpened);
    this.isSidenavOpened = true;

    if (this.drawer && this.sidenavMode === 'side') {
      this.drawer.open(); // Desktop explizit öffnen
    }
  }

  onContentClick() {
    if (this.isLargeScreen && this.isSidenavOpened === true) {
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

  ngAfterViewInit() {
    console.log('drawer ref:', this.drawer);
  }

  logout() {
  this.authService.logout();
}
}