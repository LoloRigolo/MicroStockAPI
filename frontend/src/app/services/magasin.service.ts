import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Magasin {
  _id?: string;
  nom: string;
  adresse: string;
}

@Injectable({
  providedIn: 'root'
})
export class MagasinService {
  private apiUrl = '/magasins';

  constructor(private http: HttpClient) {}

  getAllMagasins(): Observable<Magasin[]> {
    return this.http.get<Magasin[]>(this.apiUrl);
  }
}
