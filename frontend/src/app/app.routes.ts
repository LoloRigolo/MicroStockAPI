import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    data: { header: false }
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    data: { header: false }
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
    data: { header: false }
  },
  {
    path: 'dashboard-user',
    loadComponent: () =>
      import('./pages/dashboard-user/dashboard-user.component').then(
        (m) => m.DashboardUserComponent
      ),
    data: { header: true }
  },
  {
    path: 'dashboard-magasin',
    loadComponent: () =>
      import('./pages/dashboard-magasin/dashboard-magasin.component').then(
        (m) => m.DashboardMagasinComponent
      ),
    data: { header: true }
  },
  {
    path: 'dashboard-admin',
    loadComponent: () =>
      import('./pages/dashboard-admin/dashboard-admin.component').then(
        (m) => m.DashboardAdminComponent
      ),
    data: { header: true }
  },
  {
    path: 'panier',
    loadComponent: () =>
      import('./pages/panier/panier.component').then((m) => m.PanierComponent),
    data: { header: true }
  },
  {
    path: 'commandes',
    loadComponent: () =>
      import('./pages/commandes/commandes.component').then((m) => m.CommandesComponent),
    data: { header: true }
  },
  {
    path: 'commandes/:id',
    loadComponent: () =>
      import('./pages/commandes-details/commandes-detail/commandes-detail.component')
        .then((m) => m.CommendesDetailsComponent),
    data: { header: true }
  }
];
