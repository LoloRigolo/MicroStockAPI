import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Marchandise {
  nom: string;
  prix: number;
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
}