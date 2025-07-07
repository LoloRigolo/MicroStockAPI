import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MarchandiseService, Marchandise } from '../../services/marchandise.service';
import { PanierService } from '../../services/panier.service';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
})
export class DashboardUserComponent implements OnInit {
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

  addToPanier(marchandise: Marchandise) {
    const user_id = 'USER_ID_FIXE_POUR_TEST';

    this.panierService.createPanier(user_id, [marchandise]).subscribe({
      next: (res) => {
        console.log('Article ajouté au panier →', res);
        alert('Article ajouté au panier !');
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l’ajout au panier.');
      }
    });
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
