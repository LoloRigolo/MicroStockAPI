import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { Relay } from '../models/relay';

@Injectable({
  providedIn: 'root',
})
export class RelaysService {

  private apiUrl = `${environment.API_URL}/livraison`;

  constructor(private http: HttpClient) { }

  getRelay(): Observable<Relay[]> {
    return this.http.get<Relay[]>(this.apiUrl);
  }

  createRelay(relay: Relay): Observable<Relay> {
    return this.http.post<Relay>(this.apiUrl, relay);
  }

  deleteRelay(relayId?: number): Observable<Relay[]> {
    return this.http.delete<Relay[]>(`${this.apiUrl}/delete/${relayId}`);
  }
}
