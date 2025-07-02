import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login({ username: this.email, password: this.password })

      .subscribe({
        next: (data: any) => {
          console.log(data);
          localStorage.setItem('access_token', data.access);
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Identifiants invalides';
        }
      });
  }
}
