// src/app/pages/commandes/commandes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { CommandeService } from '../../services/commande.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
      console.log('✅ userId récupéré du token :', this.userId);

      this.loadCommandes();
    }
  }

  loadCommandes() {
    this.commandeService.getCommandesByUser(this.userId).subscribe({
      next: (res) => {
        this.commandes = res;
        console.log('✅ Commandes récupérées :', this.commandes);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des commandes.';
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
