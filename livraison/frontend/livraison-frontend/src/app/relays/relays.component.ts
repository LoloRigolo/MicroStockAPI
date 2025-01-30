import { Component, OnInit } from '@angular/core';
import { Relay } from '../models/relay';
import { RelaysService } from '../services/relays.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-relays',
  imports: [ NgFor ],
  templateUrl: './relays.component.html',
  styleUrls: ['./relays.component.scss']
})
export class RelaysComponent implements OnInit {

  relayList: Relay[] = [];

  constructor(private relaysService: RelaysService) { }

  ngOnInit(): void {
    this.loadRelays();
  }

  loadRelays(): void {
    this.relaysService.getRelay().subscribe({
      next: data => {
        this.relayList = data;
      },
      error: () => {
        console.error('Erreur lors du chargement des relays');
      }
    });
  }

  deleteRelay(relay: Relay): void {
    if (!relay.id) return; // Vérification si l'ID existe

    this.relaysService.deleteRelay(relay.id).subscribe({
      next: () => {
        // Met à jour la liste sans recharger la page
        this.relayList = this.relayList.filter(r => r.id !== relay.id);
      },
      error: () => {
        console.error('Erreur lors de la suppression du relay');
      }
    });
  }
}
