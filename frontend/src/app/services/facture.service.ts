import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = '/facture';

  constructor(private http: HttpClient) {}

   downloadFacture(commande: any) {
    return this.http.post(
      `${this.apiUrl}/generate-facture`,
      { commande },
      { responseType: 'blob' }
    );
  }
}
