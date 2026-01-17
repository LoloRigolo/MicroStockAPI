import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  decodeJwtPayload(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const json = atob(payload);
      return JSON.parse(json);
    } catch (e) {
      console.error('Erreur décodage token :', e);
      return null;
    }
  }

  onSubmit() {
    this.authService
      .login({ username: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          console.log('Réponse brute →', res);

          if (res && res.token && typeof res.token === 'string') {
            localStorage.setItem('token', res.token);
            console.log('Token brut →', res.token);

            const decoded = this.decodeJwtPayload(res.token);
            console.log('Décodé →', decoded);

            const role = decoded?.role?.toLowerCase();
            console.log('Role →', role);

            switch (role) {
              case 'user':
                this.router.navigate(['/dashboard-user']);
                break;
              case 'magasin':
                this.router.navigate(['/dashboard-magasin']);
                break;
              case 'admin':
                this.router.navigate(['/dashboard-admin']);
                break;
              default:
                this.router.navigate(['/login']);
                break;
            }
          } else if (res && (res.error || res.message)) {
            this.error = res.error || res.message;
          } else {
            this.error = 'Erreur inconnue lors du login.';
          }
        },
        error: (err: any) => {
          console.error(err);
          this.error =
            err.error?.error ||
            err.error?.message ||
            'Identifiants invalides. Veuillez réessayer.';
        },
      });
  }
}
