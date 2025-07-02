import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MarchandiseService, Marchandise } from '../services/marchandise.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // si tu utilises standalone components
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  marchandises: Marchandise[] = [];
  error: string | null = null;

  constructor(private marchandiseService: MarchandiseService) { }

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
}
