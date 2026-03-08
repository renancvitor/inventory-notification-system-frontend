import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../../auth/auth.models';
import { catchError, map, Observable, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private loggedIn = false;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(() => this.loggedIn = true)
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.loggedIn = false)
    );
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  checkSession(): Observable<boolean> {
    return this.http.get<LoginResponse>(`${this.apiUrl}/auth/me`, {
      withCredentials: true
    }).pipe(
      tap(() => this.loggedIn = true),
      map(() => true),
      catchError(() => {
        this.loggedIn = false;
        return of(false);
      })
    )
  }

}
