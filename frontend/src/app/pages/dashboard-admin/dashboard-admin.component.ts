import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Stockage, StockageService } from '../../services/stockage.service';
import { MagasinService } from '../../services/magasin.service';
import { MarchandiseService } from '../../services/marchandise.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  
  newUser = {
  username: '',    // ← avant c'était "email"
  password: '',
  role: 'User'
};

  stockages: Stockage[] = [];
  magasins: any[] = [];
  marchandises: any[] = [];

  error = '';
  success = '';

  newStockage: Stockage = {
    id_magasin: '',
    id_marchandise: '',
    volume: 0
  };

  constructor(
    private authService: AuthService,
    private stockageService: StockageService,
    private magasinService: MagasinService,
    private marchandiseService: MarchandiseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStockages();
    this.loadMagasins();
    this.loadMarchandises();
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

  loadMagasins() {
    this.magasinService.getAllMagasins().subscribe({
      next: (data) => {
        this.magasins = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadMarchandises() {
    this.marchandiseService.getAllMarchandises().subscribe({
      next: (data) => {
        this.marchandises = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  createUser() {
    this.authService.register(this.newUser).subscribe({
      next: () => {
        this.success = 'Utilisateur créé avec succès !';
        this.newUser = { username: '', password: '', role: 'User' };
        this.error = '';
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la création de l’utilisateur.';
        this.success = '';
      }
    });
  }

  onAddStockage() {
    this.stockageService.createStockage(this.newStockage).subscribe({
      next: () => {
        this.success = 'Stockage ajouté avec succès !';
        this.newStockage = {
          id_magasin: '',
          id_marchandise: '',
          volume: 0
        };
        this.loadStockages();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de l’ajout du stockage.';
      }
    });
  }

  deleteStockageByRef(id_magasin: string, id_marchandise: string) {
    this.stockageService.deleteStockageByRef(id_magasin, id_marchandise).subscribe({
      next: () => {
        this.success = 'Stockage supprimé avec succès.';
        this.loadStockages();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la suppression du stockage.';
      }
    });
  }

  increment(stockage: Stockage) {
    this.stockageService.updateVolume(stockage._id!, 1).subscribe({
      next: () => this.loadStockages(),
      error: (err) => console.error(err)
    });
  }

  decrement(stockage: Stockage) {
    this.stockageService.updateVolume(stockage._id!, -1).subscribe({
      next: () => this.loadStockages(),
      error: (err) => console.error(err)
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }
}