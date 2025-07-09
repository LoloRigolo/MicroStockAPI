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
      role: ['', Validators.required],  
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          console.log('User registered!', res);
          // Stocker le token si backend le renvoie
          if (res.token) {
            localStorage.setItem('token', res.token);
            const decoded: any = jwtDecode(res.token);

            switch (decoded.role) {
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
          } else {
            this.router.navigate(['/dashboard-user']);
          }
        },
        error: (err: any) => {
          console.error(err);
          this.errorMessage = err.error?.error || 'Erreur lors de la création du compte';
        }
      });
    }
  }
}
