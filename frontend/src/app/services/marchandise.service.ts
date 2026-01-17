import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Marchandise {
  _id?: string;
  nom: string;
  prix: number;
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

  createProduit(produit: Marchandise): Observable<Marchandise> {
    return this.http.post<Marchandise>(this.apiUrl, produit);
  }

  deleteMarchandise(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
