import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Stockage, StockageService } from '../../services/stockage.service';
import { MagasinService } from '../../services/magasin.service';
import { MarchandiseService } from '../../services/marchandise.service';

type Tab = 'createUser' | 'listStock' | 'addStock';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  // onglet actif
  activeTab: Tab = 'createUser';

  // pour createUser
  newUser = { username: '', password: '', role: 'User' };
  error = '';
  success = '';

  // pour listStock et addStock
  stockages: Stockage[] = [];
  magasins: any[] = [];
  marchandises: any[] = [];
  newStockage: Stockage = { id_magasin: '', id_marchandise: '', volume: 0 };

  constructor(
    private authService: AuthService,
    private stockageService: StockageService,
    private magasinService: MagasinService,
    private marchandiseService: MarchandiseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // on prépare déjà la liste pour l'afficher si l'utilisateur bascule
    this.loadMagasins();
    this.loadMarchandises();
    this.loadStockages();
  }

  // changement d'onglet
  selectTab(tab: Tab) {
    this.activeTab = tab;
    if (tab === 'listStock') this.loadStockages();
  }

  
  createUser() {
  this.authService.register(this.newUser).subscribe({
    next: () => {
      this.success = 'Utilisateur créé avec succès !';

      setTimeout(() => this.success = '', 10_000);

      this.newUser = { username: '', password: '', role: 'User' };
      this.error = '';
    },
    error: (err) => {
      this.error = 'Erreur lors de la création de l’utilisateur.';
      setTimeout(() => this.error = '', 10_000);
      this.success = '';
    }
  });
}

  // === List Stockages ===
  loadStockages() {
    this.stockageService.getAllStockages().subscribe({
      next: list => this.stockages = list,
      error: () => this.error = 'Impossible de charger les stockages.'
    });
  }
  deleteStockageByRef(id_magasin: string, id_marchandise: string) {
    this.stockageService.deleteStockageByRef(id_magasin, id_marchandise).subscribe({
      next: () => this.loadStockages(),
      error: () => this.error = 'Échec de la suppression.'
    });
  }
  increment(s: Stockage) {
    this.stockageService.updateVolume(s._id!, 1).subscribe(() => this.loadStockages());
  }
  decrement(s: Stockage) {
    this.stockageService.updateVolume(s._id!, -1).subscribe(() => this.loadStockages());
  }

  // === Ajouter Stockage ===
  loadMagasins() {
    this.magasinService.getAllMagasins().subscribe({
      next: list => this.magasins = list,
      error: () => {}
    });
  }
  loadMarchandises() {
    this.marchandiseService.getAllMarchandises().subscribe({
      next: list => this.marchandises = list,
      error: () => {}
    });
  }
  onAddStockage() {
  this.stockageService.createStockage(this.newStockage).subscribe({
    next: () => {
      this.success = 'Stockage ajouté avec succès !';
      setTimeout(() => this.success = '', 10_000);

      this.newStockage = { id_magasin: '', id_marchandise: '', volume: 0 };
      this.loadStockages();
    },
    error: (err) => {
      this.error = 'Erreur lors de l’ajout du stockage.';
      setTimeout(() => this.error = '', 10_000);
    }
  });
}

  logout() {
    this.router.navigate(['/login']);
  }
}
