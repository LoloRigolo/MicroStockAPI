import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
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
  {
    path: 'dashboard-user',
    loadComponent: () =>
      import('./pages/dashboard-user/dashboard-user.component').then(
        (m) => m.DashboardUserComponent
      ),
  },
  {
    path: 'dashboard-magasin',
    loadComponent: () =>
      import('./pages/dashboard-magasin/dashboard-magasin.component').then(
        (m) => m.DashboardMagasinComponent
      ),
  },
  {
    path: 'dashboard-admin',
    loadComponent: () =>
      import('./pages/dashboard-admin/dashboard-admin.component').then(
        (m) => m.DashboardAdminComponent
      ),
  },
];
