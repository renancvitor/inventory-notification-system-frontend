import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  list(params?: { page?: number; size?: number; search?: string; active?: boolean; categoryId?: number; minPrice?: number; maxPrice?: number }) {
    return this.http.get(this.apiUrl, { 
      params: {
        ...(params?.page !== undefined && { page:params.page }),
        ...(params?.size !== undefined && { size:params.size }),
        ...(params?.search !== undefined && { search:params.search }),
        ...(params?.active !== undefined && { active:params.active }),
        ...(params?.categoryId !== undefined && { categoryId:params.categoryId }),
        ...(params?.minPrice !== undefined && { minPrice:params.minPrice }),
        ...(params?.maxPrice !== undefined && { maxPrice:params.maxPrice }),
     },
    withCredentials: true 
    });
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { 
      withCredentials: true
     });
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { 
      withCredentials: true
     });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      withCredentials: true
     });
  }

  activate(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activate`, {}, { 
      withCredentials: true
     });
  }

}  
