import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  list(params?: {active?: boolean; page?: number; size?: number; search?: string }) {
    return this.http.get(this.apiUrl, {
      params: {
        ...(params?.active !== undefined && { active:params.active }),
        ...(params?.page !== undefined && { page:params.page }),
        ...(params?.size !== undefined && { size:params.size }),
        ...(params?.search !== undefined && { search:params.search }),
      },
      withCredentials: true
    });
  }

  updateUserType(id: number, userType: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/type/${id}`, { userType }, {
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  activate(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/activate`, {}, {
      withCredentials: true
    });
  }
  
}
