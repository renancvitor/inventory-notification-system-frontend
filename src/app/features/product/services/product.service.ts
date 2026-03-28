import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ProductListItem {
  id: number;
  productName: string;
  category: string;
  price: number;
  validity?: string;
  description?: string;
  stock: number;
  minimumStock?: number;
  brand: string;
  active: boolean;
}

export interface ProductListResponse {
  content: ProductListItem[];
  totalElements: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly categoriesUrl = `${environment.apiUrl}/categories`;
  private categoriesRequest$?: Observable<ProductCategory[]>;

  constructor(private http: HttpClient) {}

  list(params?: { page?: number; size?: number; search?: string; active?: boolean; categoryId?: number; minPrice?: number; maxPrice?: number }): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(this.apiUrl, {
      params: {
        ...(params?.page !== undefined && { page: params.page }),
        ...(params?.size !== undefined && { size: params.size }),
        ...(params?.search !== undefined && { search: params.search }),
        ...(params?.active !== undefined && { active: params.active }),
        ...(params?.categoryId !== undefined && { categoryId: params.categoryId }),
        ...(params?.minPrice !== undefined && { minPrice: params.minPrice }),
        ...(params?.maxPrice !== undefined && { maxPrice: params.maxPrice }),
      },
      withCredentials: true
    });
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      withCredentials: true
    });
  }

  listCategories(forceRefresh = false): Observable<ProductCategory[]> {
    if (!this.categoriesRequest$ || forceRefresh) {
      this.categoriesRequest$ = this.http.get<ProductCategory[]>(this.categoriesUrl, {
        withCredentials: true
      }).pipe(
        shareReplay(1)
      );
    }

    return this.categoriesRequest$;
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

  categories(id: number, data: { categoryId: number }) {
    return this.http.put(`${this.apiUrl}/${id}/categories`, data, {
      withCredentials: true
    });
  }

  getById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

}
