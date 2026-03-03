import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../../auth/auth.models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data,
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`, {
      withCredentials: true,
    });
  }
}
