import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stockage {
  _id?: string;
  id_magasin: string;
  id_marchandise: string;
  volume: number;
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

  createStockage(data: Stockage): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateStockage(id: string, data: Stockage): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteStockage(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
