import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PersonService {

  private readonly apiUrl = `${environment.apiUrl}/person`;

  constructor(private http: HttpClient) {}

  list(params?: { active?: boolean; page?: number; size?: number }) {
    return this.http.get(this.apiUrl, {
      params: {
        ...(params?.active !== undefined && { active: params.active }),
        ...(params?.page !== undefined && { page: params.page }),
        ...(params?.size !== undefined && { size: params.size }),
      },
      withCredentials: true
    });
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
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
