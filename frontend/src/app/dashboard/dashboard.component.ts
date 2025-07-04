import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MarchandiseService, Marchandise } from '../services/marchandise.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true, // si tu utilises standalone components
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  marchandises: Marchandise[] = [];
  error: string | null = null;
  newProduit = { nom: '', prix: 0 };

  constructor(private marchandiseService: MarchandiseService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadMarchandises();
  }
  onLogout() {
    this.authService.logout();
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
    console.log('Produit à ajouter:', this.newProduit);
  this.marchandiseService.createProduit(this.newProduit).subscribe({
    
    next: (produit) => {
      // Mise à jour de la liste après ajout
      this.marchandises.push(produit);
      this.newProduit = { nom: '', prix: 0 }; // Reset formulaire
      console.log('Produit ajouté avec succès', Response);
    },
    error: (err) => {
      console.error('Erreur ajout produit', err);
    }
    
  });
  }

}
