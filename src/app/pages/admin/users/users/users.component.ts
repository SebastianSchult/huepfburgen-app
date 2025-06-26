import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';

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
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  displayedColumns: string[] = ['email', 'role', 'actions'];

  users = [
    { email: 'admin@example.com', role: 'admin' },
    { email: 'user@example.com', role: 'user' },
  ];

  constructor(private router: Router) {}

  navigateToNewUser() {
    this.router.navigate(['/admin/users/new']);
  }
}