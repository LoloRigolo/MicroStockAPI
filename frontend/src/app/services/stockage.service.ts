import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stockage {
  _id?: string;
  id_magasin: string;
  id_marchandise: string;
  volume: number;
  nom_magasin?: string;
  nom_marchandise?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockageService {
  private apiUrl = '/stockage';

  constructor(private http: HttpClient) {}

  getAllStockages(): Observable<Stockage[]> {
    return this.http.get<Stockage[]>(this.apiUrl);
  }

  createStockage(stockage: Stockage): Observable<any> {
    return this.http.post<any>(this.apiUrl, stockage);
  }

  deleteStockage(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  deleteStockageByRef(id_magasin: string, id_marchandise: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id_magasin}/${id_marchandise}`);
  }

  updateVolume(id: string, variation: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/volume`, { variation });
  }
}
