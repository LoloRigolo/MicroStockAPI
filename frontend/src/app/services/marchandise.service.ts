import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Marchandise {
  _id?: string;
  nom: string;
  prix: number;
  quantite?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MarchandiseService {
  private apiUrl = '/marchandises';

  constructor(private http: HttpClient) {}

  getAllMarchandises(): Observable<Marchandise[]> {
    return this.http.get<Marchandise[]>(this.apiUrl);
  }

  createProduit(produit: { nom: string, prix: number }): Observable<any> {
    return this.http.post(this.apiUrl, produit);
  }
}
