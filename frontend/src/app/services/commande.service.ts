import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = '/commandes';

  constructor(private http: HttpClient) {}

   createCommandeFromPanier(panierId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/from-panier/${panierId}`, {});
  }

 
 
  getAllCommandes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCommandesByUser(user_id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${user_id}`);
  }

  getCommandeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateCommandeStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status });
  }
}
