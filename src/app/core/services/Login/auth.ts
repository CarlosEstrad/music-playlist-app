import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginData, Register, Reply } from '../../../models/helpers';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/api/Auth`;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<Reply<LoginData>> {
    return this.http.post<Reply<LoginData>>(`${this.url}/login`, credentials).pipe(
      tap(res => {
        if (res.ok && res.data) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('username', res.data.user?.username);
          localStorage.setItem('email', res.data.user?.email);
        }
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  register(data: Register): Observable<Reply<LoginData>> {
    return this.http.post<Reply<LoginData>>(`${this.url}/register`, data);
  }

  updateProfile(data: { username: string, password?: string }): Observable<Reply<LoginData>> {
    return this.http.put<Reply<LoginData>>(`${this.url}/update-profile`, data);
  }
}