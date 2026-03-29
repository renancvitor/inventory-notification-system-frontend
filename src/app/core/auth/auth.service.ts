import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthenticatedUser, LoginRequest, LoginResponse } from './auth.model';
import { catchError, map, Observable, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private loggedIn = false;
  private currentUser: AuthenticatedUser | null = null;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data,
      { withCredentials: true }
    ).pipe(
      tap((user) => {
        this.loggedIn = true;
        this.currentUser = user;
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.loggedIn = false;
        this.currentUser = null;
      })
    );
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  checkSession(): Observable<boolean> {
    return this.http.get<AuthenticatedUser>(`${this.apiUrl}/auth/me`, {
      withCredentials: true
    }).pipe(
      tap((user) => {
        this.loggedIn = true;
        this.currentUser = user;
      }),
      map(() => true),
      catchError(() => {
        this.loggedIn = false;
        this.currentUser = null;
        return of(false);
      })
    )
  }

  getCurrentUser(): AuthenticatedUser | null {
    return this.currentUser;
  }

  getCurrentUserId(): number | null {
    return this.currentUser?.id ?? null;
  }

  mustUpdatePassword(): boolean {
    return this.currentUser?.firstAccess ?? false;
  }

  clearFirstAccess() {
    if (!this.currentUser) {
      return;
    }

    this.currentUser = {
      ...this.currentUser,
      firstAccess: false,
    };
  }

}
