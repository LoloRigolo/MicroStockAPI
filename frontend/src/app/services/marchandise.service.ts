import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Marchandise {
  _id?: string;
  nom: string;
  prix: number;
  quantite?: number;
  imageUrl?: string;
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

  createProduitWithImage(formData: FormData) {
    return this.http.post<any>(this.apiUrl, formData);
  }

  // Pour DashboardUserComponent
  createProduit(produit: { nom: string; prix: number; imageUrl?: string }) {
  return this.http.post<any>('/marchandises', produit);
}
}
