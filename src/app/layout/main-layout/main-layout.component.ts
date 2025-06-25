import { Component, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, MatCardModule, RouterModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  isLargeScreen = window.innerWidth > 768;
  isSidenavOpened = this.isLargeScreen;

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
    this.drawer.open(); // ← hilft bei Desktop-Modus (side)
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
  this.drawer.close(); // ← triggert onSidenavStateChange automatisch
}

  ngAfterViewInit() {
  console.log('drawer ref:', this.drawer);
}
}
