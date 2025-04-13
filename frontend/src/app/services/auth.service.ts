import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  loginQuick(username: string, password: string): Observable<any> {
    return this.http.get(`http://localhost:3010/auth/login/${username}/${password}`);
  }
}
