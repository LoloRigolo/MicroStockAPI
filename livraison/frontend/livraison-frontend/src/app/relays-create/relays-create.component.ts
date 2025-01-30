import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RelaysService } from '../services/relays.service';
import { Relay } from '../models/relay';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './relays-create.component.html',
  styleUrl: './relays-create.component.scss'
})
export class RelaysCreateComponent {

  createRelayForm: FormGroup;

  constructor(private fb: FormBuilder, private relayService: RelaysService, private router: Router) {
    this.createRelayForm = this.fb.group({
      nom: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.createRelayForm.valid) {
      const relay: Relay = {
        nom: this.createRelayForm.get('nom')?.value,
        lat: this.createRelayForm.get('lat')?.value,
        lng: this.createRelayForm.get('lng')?.value
      };

      this.relayService.createRelay(relay).subscribe({
        next: () => {
          this.router.navigate(["/relays"]);
        },
        error: () => {
          console.error('Erreur lors de la création du post');
        },
      });
    }
  }

}