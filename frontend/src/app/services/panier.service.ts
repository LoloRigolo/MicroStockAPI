import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
 private apiUrl = '/panier';

  constructor(private http: HttpClient) {}

  createPanier(user_id: string, articles: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { user_id, articles });
  }

  getPanierByUser(user_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${user_id}`);
  }

  updatePanier(panierId: string, articles: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${panierId}`, { articles });
  }

}
