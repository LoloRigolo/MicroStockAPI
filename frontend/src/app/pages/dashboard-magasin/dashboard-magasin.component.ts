import { Component } from '@angular/core';
import { Marchandise, MarchandiseService } from '../../services/marchandise.service';
import { PanierService } from '../../services/panier.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockageImagesService } from '../../services/stockage-images.service';

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
export class DashboardMagasinComponent {
  marchandises: Marchandise[] = [];
  error = '';
  newProduit: { nom: string; prix: number } = { nom: '', prix: 0 };

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private marchandiseService: MarchandiseService,
    private panierService: PanierService,
    private stockageImagesService: StockageImagesService,
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

  uploadImageAndCreateProduit() {
    if (!this.selectedImage) {
      this.error = "Sélectionne d'abord une image !";
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedImage);

    this.stockageImagesService.uploadImage(formData).subscribe({
      next: (res) => {
        const imageUrl = res.imageUrl;

        this.marchandiseService.createProduit({
          nom: this.newProduit.nom,
          prix: this.newProduit.prix,
          imageUrl
        }).subscribe({
          next: () => {
            this.loadMarchandises();
            this.newProduit = { nom: '', prix: 0 };
            this.selectedImage = null;
            this.imagePreview = null;
          },
          error: (err) => {
            console.error(err);
            this.error = 'Erreur lors de l’ajout de la marchandise.';
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de l’upload de l’image.';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
