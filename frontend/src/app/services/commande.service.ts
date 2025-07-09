import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = '/commandes';

  constructor(private http: HttpClient) {}

  createCommandeFromPanier(id_panier: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/from-panier/${id_panier}`, {});
  }



  getCommandesByUser(user_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${user_id}`);
  }

  getCommandeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
