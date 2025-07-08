import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PanierService } from '../../services/panier.service';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Marchandise, MarchandiseService } from '../../services/marchandise.service';
import { CommandeService } from '../../services/commande.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss'],
  imports: [CommonModule, RouterModule, HttpClientModule],
})
export class PanierComponent implements OnInit {
  userId = '';
  panierArticles: any[] = [];
  error = '';
  articles: any[] = [];
  marchandises: Marchandise[] = [];
  panierId: string = '';
  currentPanierId = '';

  constructor(
    private panierService: PanierService,
    private marchandiseService: MarchandiseService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
      console.log('userId récupéré du token :', this.userId);
    }

    this.loadPanier();
  }

  loadPanier() {
    if (!this.userId) return;

    this.marchandiseService.getAllMarchandises().subscribe({
      next: (marchandises) => {
        this.marchandises = marchandises;

        this.panierService.getPanierByUser(this.userId).subscribe({
          next: (paniers) => {
            const panier = paniers && paniers.length > 0 ? paniers[0] : null;

            if (panier) {
              this.panierId = panier._id;

              this.panierArticles = panier.articles.map((a: any) => {
                const marchandise = this.marchandises.find(
                  (m) => m._id === a.article_id
                );

                return {
                  article_id: a.article_id,
                  nom: marchandise?.nom || a.article_id,
                  prix: marchandise?.prix || a.prix,
                  quantite: a.quantite,
                };
              });
            } else {
              this.panierArticles = [];
            }
          },
          error: (err) => {
            console.error(err);
            this.error = 'Erreur lors du chargement du panier.';
          }
        });
      }
    });
  }

  validatePanier() {
    if (!this.panierId) {
      alert('Panier introuvable.');
      return;
    }

    this.commandeService.createCommandeFromPanier(this.panierId).subscribe({
      next: (res) => {
        console.log('Commande créée : ', res);
        alert('Commande validée !');
        this.router.navigate(['/dashboard-user']);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la validation du panier.');
      }
    });
  }

  increaseQuantity(article: any) {
  article.quantite += 1;
  this.updateArticle(article);
}

decreaseQuantity(article: any) {
  if (article.quantite > 1) {
    article.quantite -= 1;
    this.updateArticle(article);
  } else {
    this.removeArticle(article);
  }
}

removeArticle(article: any) {
  if (!this.currentPanierId) return;

  this.articles = this.articles.filter(a => a !== article);

  const updatedArticles = this.articles.map(a => ({
    article_id: a.article_id,
    nom: a.nom,
    prix: a.prix,
    quantite: a.quantite
  }));

  this.panierService.updatePanier(this.currentPanierId, updatedArticles)
    .subscribe({
      next: () => {
        console.log("Article supprimé du panier");
      },
      error: (err) => {
        console.error(err);
      }
    });
}

emptyPanier() {
  if (!this.currentPanierId) return;

  this.panierService.updatePanier(this.currentPanierId, []).subscribe({
    next: () => {
      console.log("Panier vidé");
      this.articles = [];
    },
    error: (err) => {
      console.error(err);
    }
  });
}

updateArticle(article: any) {
  if (!this.currentPanierId) return;

  const updatedArticles = this.articles.map(a => ({
    article_id: a.article_id,
    nom: a.nom,
    prix: a.prix,
    quantite: a.quantite
  }));

  this.panierService.updatePanier(this.currentPanierId, updatedArticles)
    .subscribe({
      next: () => {
        console.log("Quantité mise à jour");
      },
      error: (err) => {
        console.error(err);
      }
    });
}


  retourDashboard() {
    this.router.navigate(['/dashboard-user']);
  }
}
