import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AdminGuard } from './guards/auth.guard'; // ggf. Pfad prüfen

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },

      // 🔐 Geschützter Admin-Bereich
      {
        path: 'admin',
        canActivate: [AdminGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/admin/admin/admin.component').then(
                (m) => m.AdminComponent
              ),
          },
          {
            path: 'equipment',
            loadComponent: () =>
              import('./pages/admin/equipment/equipment/equipment.component').then(
                (m) => m.EquipmentComponent
              ),
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/users/users/users.component').then(
                (m) => m.UsersComponent
              ),
          },
          {
            path: 'users/new',
            loadComponent: () =>
              import('./pages/admin/users/new-user/new-user.component').then(
                (m) => m.NewUserComponent
              ),
          },
          {
            path: 'users/edit/:uid',
            loadComponent: () =>
              import('./pages/admin/users/edit-user/edit-user.component').then(
                (m) => m.EditUserComponent
              ),
          },
        ],
      },
    ],
  },

  // 🔓 Öffentlich zugängliche Seiten
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
];