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
  panierArticles: Array<{
    article_id: string;
    nom: string;
    prix: number;
    imageUrl: string;
    quantite: number;
  }> = [];
  error = '';
  marchandises: Marchandise[] = [];
  panierId = '';

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
            const panier = paniers?.[0];
            if (!panier) {
              this.panierArticles = [];
              return;
            }
            this.panierId = panier._id;
            this.panierArticles = panier.articles.map((a: any) => {
              const m = this.marchandises.find(m => m._id === a.article_id) || {};

  const rawUrl = (m as any).imageUrl || '';
  const imageUrl = rawUrl.startsWith('/') ? rawUrl : `/uploads/${rawUrl}`;

  return {
    article_id: a.article_id,
    nom:         (m as any).nom       || 'Produit inconnu',
    prix:        (m as any).prix      || 0,
    imageUrl:    imageUrl,
    quantite:    a.quantite
  };
            });
          },
          error: err => {
            console.error(err);
            this.error = 'Erreur lors du chargement du panier.';
          }
        });
      },
      error: err => console.error(err)
    });
  }

  increaseQuantity(a: any) {
    a.quantite++;
    this.updatePanier();
  }

  decreaseQuantity(a: any) {
    if (a.quantite > 1) {
      a.quantite--;
      this.updatePanier();
    } else {
      this.removeArticle(a);
    }
  }

  removeArticle(a: any) {
    this.panierArticles = this.panierArticles.filter(x => x.article_id !== a.article_id);
    this.updatePanier();
  }

  emptyPanier() {
    this.panierArticles = [];
    this.updatePanier();
  }

  updatePanier() {
    if (!this.panierId) return;
    const updated = this.panierArticles.map(a => ({
      article_id: a.article_id,
      quantite:   a.quantite
    }));
    this.panierService.updatePanier(this.panierId, updated).subscribe({
      next: () => {},
      error: err => {
        console.error(err);
        this.error = 'Erreur lors de la mise à jour du panier.';
      }
    });
  }

  validatePanier() {
    if (!this.panierId) return alert('Panier introuvable.');
    this.commandeService.createCommandeFromPanier(this.panierId).subscribe({
      next: () => {
        alert('Commande validée !');
        this.router.navigate(['/dashboard-user']);
      },
      error: err => {
        console.error(err);
        alert('Erreur lors de la validation.');
      }
    });
  }
}
