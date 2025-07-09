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
  marchandises: Marchandise[] = [];
  panierId: string = '';

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
      console.log('✅ userId récupéré du token :', this.userId);
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

  increaseQuantity(article: any) {
    article.quantite += 1;
    this.updatePanier();
  }

  decreaseQuantity(article: any) {
    if (article.quantite > 1) {
      article.quantite -= 1;
      this.updatePanier();
    } else {
      this.removeArticle(article);
    }
  }

  removeArticle(article: any) {
    this.panierArticles = this.panierArticles.filter(
      (a) => a.article_id !== article.article_id
    );
    this.updatePanier();
  }

  emptyPanier() {
    this.panierArticles = [];
    this.updatePanier();
  }

  updatePanier() {
    if (!this.panierId) {
      console.error("Panier introuvable");
      return;
    }

    const updatedArticles = this.panierArticles.map((a) => ({
      article_id: a.article_id,
      quantite: a.quantite,
    }));

    this.panierService.updatePanier(this.panierId, updatedArticles)
      .subscribe({
        next: () => {
          console.log("✅ Panier mis à jour en base !");
        },
        error: (err) => {
          console.error(err);
          this.error = "Erreur lors de la mise à jour du panier.";
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
        console.log('✅ Commande créée : ', res);
        alert('Commande validée !');
        this.router.navigate(['/dashboard-user']);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la validation du panier.');
      }
    });
  }

  retourDashboard() {
    this.router.navigate(['/dashboard-user']);
  }
}
