// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
   imports: [
    RouterModule         
  ],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  onLogout() {
    this.router.navigate(['/login']);
  }
}
