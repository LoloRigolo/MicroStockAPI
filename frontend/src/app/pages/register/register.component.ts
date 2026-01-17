import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    // On envoie username, password + role forcé à 'user'
    const payload = {
      ...this.registerForm.value,
      role: 'user'
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        // … même logique qu'avant pour stocker le token ou rediriger
        if (res.token) {
          localStorage.setItem('token', res.token);
          const decoded: any = jwtDecode(res.token);
          this.router.navigate(['/dashboard-user']);
        } else {
          this.router.navigate(['/dashboard-user']);
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || 'Erreur lors de la création du compte';
      }
    });
  }
}