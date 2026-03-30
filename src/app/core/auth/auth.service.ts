import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthenticatedUser, LoginRequest, LoginResponse, UserTypeName } from './auth.model';
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
        this.currentUser = this.normalizeAuthenticatedUser(user);
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
        this.currentUser = this.normalizeAuthenticatedUser(user);
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

  getCurrentUserType(): UserTypeName | null {
    return this.currentUser ? this.normalizeUserType(this.currentUser.nameUserType) : null;
  }

  getCurrentUserId(): number | null {
    return this.currentUser?.id ?? null;
  }

  hasAnyUserType(userTypes: readonly UserTypeName[]): boolean {
    const currentUserType = this.getCurrentUserType();

    return currentUserType !== null && userTypes.includes(currentUserType);
  }

  isAdmin(): boolean {
    return this.hasAnyUserType(['ADMIN']);
  }

  canAccessPeople(): boolean {
    return this.isAdmin();
  }

  canAccessUsers(): boolean {
    return this.isAdmin();
  }

  canManageProducts(): boolean {
    return this.hasAnyUserType(['ADMIN', 'PRODUCT_MANAGER']);
  }

  canReviewOrders(): boolean {
    return this.hasAnyUserType(['ADMIN', 'PRODUCT_MANAGER']);
  }

  canEditOrder(order: { requestedBy?: string | null; status?: string | null } | null | undefined): boolean {
    if (!order) {
      return false;
    }

    const isOwner = order.requestedBy === this.currentUser?.personEmail;
    const isPending = (order.status || '').trim().toLowerCase() === 'pendente';

    return isOwner && isPending;
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

  private normalizeAuthenticatedUser(user: AuthenticatedUser): AuthenticatedUser {
    return {
      ...user,
      nameUserType: this.normalizeUserType(user.nameUserType) ?? user.nameUserType,
    };
  }

  private normalizeUserType(userType: string | null | undefined): UserTypeName | null {
    if (!userType) {
      return null;
    }

    const normalized = userType.trim().toLowerCase();

    switch (normalized) {
      case 'admin':
      case 'administrador':
        return 'ADMIN';
      case 'product_manager':
      case 'product manager':
      case 'gerenciador de produtos':
        return 'PRODUCT_MANAGER';
      case 'common':
      case 'comum':
        return 'COMMON';
      default:
        return null;
    }
  }

}
