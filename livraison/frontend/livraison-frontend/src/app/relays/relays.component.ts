import { Component, OnInit } from '@angular/core';
import { Relay } from '../models/relay';
import { RelaysService } from '../services/relays.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-relays',
  imports: [ NgFor, RouterLink ],
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
    console.log(relay._id)
    this.relaysService.deleteRelay(relay._id).subscribe({
      next: () => {
        window.location.reload();
      },
      error: () => {
        console.error('Erreur lors du chargement des produits');
      }
  })};
}
