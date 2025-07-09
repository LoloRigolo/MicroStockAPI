import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Stockage, StockageService } from '../../services/stockage.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent {
  newUser = {
    email: '',
    password: '',
    role: 'User'
  };

  error = '';
  success = '';

  stockages: Stockage[] = [];

  constructor(
    private authService: AuthService,
    private stockageService: StockageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStockages();
  }

  loadStockages() {
    this.stockageService.getAllStockages().subscribe({
      next: (data) => {
        this.stockages = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des stockages.';
      }
    });
  }

  createUser() {
    this.authService.register(this.newUser).subscribe({
      next: () => {
        this.success = 'Utilisateur créé avec succès !';
        this.newUser = { email: '', password: '', role: 'User' };
        this.error = '';
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la création de l’utilisateur.';
        this.success = '';
      }
    });
  }
}
