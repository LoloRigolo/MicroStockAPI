import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MarchandiseService, Marchandise } from '../../services/marchandise.service';
import { PanierService } from '../../services/panier.service';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
  ],
})
export class DashboardUserComponent implements OnInit {
  marchandises: Marchandise[] = [];
  error = '';
  newProduit: { nom: string; prix: number } = { nom: '', prix: 0 };
  selectedQuantite: number = 1;
  userId: string = '';

  constructor(
    private marchandiseService: MarchandiseService,
    private panierService: PanierService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMarchandises();
    this.loadUserId();
  }

  loadUserId() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
      console.log('✅ userId récupéré du token :', this.userId);
    }
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

  loadMarchandises() {
  this.marchandises = [];
  this.marchandiseService.getAllMarchandises().subscribe({
    next: (data) => {
      this.marchandises = data.map(m => ({
        ...m,
        quantite: 1
      }));
    },
    error: (err) => {
      console.error(err);
      this.error = 'Erreur lors du chargement des marchandises.';
    }
  });
}

addToPanier(marchandise: Marchandise, quantite: number) {
  const user_id = this.userId;
  const quantiteFinale = Math.max(1, quantite);

  this.panierService.getPanierByUser(user_id).subscribe({
    next: (paniers) => {
      if (paniers && paniers.length > 0) {
        const panier = paniers[0];

        const existingArticle = panier.articles.find(
          (a: any) => a.article_id?.toString() === (marchandise as any)._id?.toString()
        );

        console.log("Quantité choisie :", quantiteFinale);

        if (existingArticle) {
          console.log("✅ Article déjà présent → on additionne !");
          existingArticle.quantite += quantiteFinale;
        } else {
          console.log("✅ Article non présent → on le crée !");
          panier.articles.push({
            article_id: (marchandise as any)._id,
            nom: marchandise.nom,
            prix: marchandise.prix,
            quantite: quantiteFinale
          });
        }

        this.panierService.updatePanier(panier._id, panier.articles).subscribe({
          next: (res) => {
            console.log('✅ Panier mis à jour', res);
            alert(`${quantiteFinale} article(s) ajouté(s) au panier !`);
          },
          error: (err) => {
            console.error(err);
            alert("Erreur lors de l'ajout au panier (update).");
          }
        });

      } else {
        // Aucun panier → en créer un
        const newPanier = [{
          article_id: (marchandise as any)._id,
          nom: marchandise.nom,
          prix: marchandise.prix,
          quantite: quantiteFinale
        }];

        this.panierService.createPanier(user_id, newPanier).subscribe({
          next: (res) => {
            console.log('✅ Nouveau panier créé', res);
            alert(`Panier créé et ${quantiteFinale} article(s) ajouté(s) !`);
          },
          error: (err) => {
            console.error(err);
            alert("Erreur lors de la création du panier.");
          }
        });
      }
    },
    error: (err) => {
      console.error(err);
      alert("Erreur lors de la recherche du panier.");
    }
  });
}

navigateToPanier() {
  this.router.navigate(['/panier']);
}
goToCommandes() {
  this.router.navigate(['/commandes']);
}

  onLogout() {
    this.router.navigate(['/login']);
  }
}
