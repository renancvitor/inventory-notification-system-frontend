import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PersonCreatePayload,
  PersonDetail,
  PersonListResponse,
} from './person.model';

@Injectable({
  providedIn: 'root',
})
export class PersonService {

  private readonly apiUrl = `${environment.apiUrl}/person`;

  constructor(private http: HttpClient) {}

  list(params?: { active?: boolean; page?: number; size?: number; search?: string }): Observable<PersonListResponse> {
    return this.http.get<PersonListResponse>(this.apiUrl, {
      params: {
        ...(params?.active !== undefined && { active: params.active }),
        ...(params?.page !== undefined && { page: params.page }),
        ...(params?.size !== undefined && { size: params.size }),
        ...(params?.search !== undefined && { search: params.search })
      },
      withCredentials: true
    });
  }

  create(data: PersonCreatePayload): Observable<PersonDetail> {
    return this.http.post<PersonDetail>(this.apiUrl, data, {
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

  getById(id: number): Observable<PersonDetail> {
    return this.http.get<PersonDetail>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }
  
}
