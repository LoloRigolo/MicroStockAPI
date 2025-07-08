import { Component } from '@angular/core';
import { Marchandise, MarchandiseService } from '../../services/marchandise.service';
import { PanierService } from '../../services/panier.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-magasin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './dashboard-magasin.component.html',
  styleUrl: './dashboard-magasin.component.scss'
})
export class DashboardMagasinComponent {
marchandises: Marchandise[] = [];
  error = '';
  newProduit: { nom: string; prix: number } = { nom: '', prix: 0 };

 constructor(
  private marchandiseService: MarchandiseService,
  private panierService: PanierService,
  private router: Router
) {}

  ngOnInit(): void {
    this.loadMarchandises();
  }

  loadMarchandises() {
    this.marchandiseService.getAllMarchandises().subscribe({
      next: (data) => {
        this.marchandises = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des marchandises.';
      }
    });
  }

  addProduit() {
    this.marchandiseService.createProduit(this.newProduit).subscribe({
      next: () => {
        this.loadMarchandises();
        this.newProduit = { nom: '', prix: 0 };
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de l’ajout de la marchandise.';
      }
    });
  }
  onLogout() {
    this.router.navigate(['/login']);
  }
}
