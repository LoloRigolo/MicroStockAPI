import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommandeService } from '../../../services/commande.service';

@Component({
  selector: 'app-commendes-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './commandes-detail.component.html',
  styleUrls: ['./commandes-detail.component.scss']
})
export class CommendesDetailsComponent implements OnInit {
  commandeId = '';
  commande: any = null;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.commandeId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.commandeId) {
      this.error = 'ID de commande invalide.';
      return;
    }

    this.loadCommande();
  }

  loadCommande() {
    this.commandeService.getCommandeById(this.commandeId).subscribe({
      next: (res) => {
        this.commande = res;
        console.log('✅ Commande récupérée : ', this.commande);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement de la commande.';
      }
    });
  }

  retourCommandes() {
    this.router.navigate(['/commandes']);
  }
}
