import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { CommandeService } from '../../services/commande.service';
import { FactureService } from '../../services/facture.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})
export class CommandesComponent implements OnInit {
  userId = '';
  commandes: any[] = [];
  error = '';

  constructor(
    private commandeService: CommandeService,
    private factureService: FactureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
      console.log('userId récupéré du token :', this.userId);

      this.loadCommandes();
    }
  }

  loadCommandes() {
    this.commandeService.getCommandesByUser(this.userId).subscribe({
      next: (res) => {
        this.commandes = res;
        console.log('Commandes récupérées :', this.commandes);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des commandes.';
      }
    });
  }

  downloadFacture(commande: any) {
    const payload = JSON.parse(JSON.stringify(commande));

    payload.articles = payload.articles.map((art: any) => ({
      nom: art.nom,
      quantite: art.quantite,
      prix_unitaire: art.prix
    }));
    payload.total_ht = payload.articles.reduce(
      (sum: number, art: any) => sum + (art.quantite * art.prix_unitaire),
      0
    );

    payload.tva = +(payload.total_ht * 0.2).toFixed(2);
    payload.total_ttc = +(payload.total_ht + payload.tva).toFixed(2);

    console.log("Commande envoyée au microservice :", payload);

    this.factureService.downloadFacture(payload).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `facture_${commande._id}.pdf`;
        link.click();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  goToDetail(commandeId: string) {
    this.router.navigate([`/commandes/${commandeId}`]);
  }

  retourDashboard() {
    this.router.navigate(['/dashboard-user']);
  }
}
