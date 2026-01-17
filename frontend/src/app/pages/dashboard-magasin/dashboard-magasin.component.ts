import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule }  from '@angular/common/http';

import { Marchandise, MarchandiseService } from '../../services/marchandise.service';
import { PanierService }       from '../../services/panier.service';
import { StockageImagesService } from '../../services/stockage-images.service';
import { CommandeService }     from '../../services/commande.service';


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
  styleUrls: ['./dashboard-magasin.component.scss']
})
export class DashboardMagasinComponent implements OnInit {
  // onglet actif: 'list', 'add', 'orders'
  section: 'list' | 'add' | 'orders' = 'list';

  marchandises: Marchandise[] = [];
  commandes: any[] = [];
  error = '';


  // création de produit
  newProduit = { nom: '', prix: 0 };
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private marchandiseService: MarchandiseService,
    private panierService: PanierService,
    private stockageImagesService: StockageImagesService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMarchandises();
    this.loadCommandes();
  }

  // switch d’onglet
  show(sec: 'list' | 'add' | 'orders') {
    this.section = sec;
    this.error = '';
  }

  // marchandises
  loadMarchandises() {
    this.marchandiseService.getAllMarchandises().subscribe({
      next: data => this.marchandises = data,
      error: err => { console.error(err); this.error = 'Erreur chargement produits.'; }
    });
  }
  deleteProduit(id: string) {
    this.marchandiseService.deleteMarchandise(id).subscribe({
      next: () => this.loadMarchandises(),
      error: err => { console.error(err); this.error = 'Erreur suppression produit.'; }
    });
  }

  // création
  onFileSelected(e: any) {
    const f = e.target.files[0];
    if (f) {
      this.selectedImage = f;
      const reader = new FileReader();
      reader.onload = ev => this.imagePreview = (ev.target as any).result;
      reader.readAsDataURL(f);
    }
  }
  uploadImageAndCreateProduit() {
    if (!this.selectedImage) {
      this.error = 'Sélectionnez une image !'; return;
    }
    const fd = new FormData();
    fd.append('image', this.selectedImage);
    this.stockageImagesService.uploadImage(fd).subscribe({
      next: res => {
        const url = res.url;
        this.marchandiseService.createProduit({
          nom:   this.newProduit.nom,
          prix:  this.newProduit.prix,
          imageUrl: url
        }).subscribe({
          next: () => {
            this.newProduit = { nom: '', prix: 0 };
            this.selectedImage = null; this.imagePreview = null;
            this.loadMarchandises();
            this.section = 'list';
          },
          error: err => { console.error(err); this.error = 'Erreur création produit.'; }
        });
      },
      error: err => { console.error(err); this.error = 'Erreur upload image.'; }
    });
  }

  // commandes
  loadCommandes() {
    this.commandeService.getAllCommandes().subscribe({
      next: res => this.commandes = res,
      error: err => { console.error(err); this.error = 'Erreur chargement commandes.'; }
    });
  }
  updateStatus(id: string, status: string) {
    this.commandeService.updateCommandeStatus(id, status).subscribe({
      next: () => this.loadCommandes(),
      error: err => { console.error(err); this.error = 'Erreur maj statut.'; }
    });
  }

  // déconnexion
 
}
