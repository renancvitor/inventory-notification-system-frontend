import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ProductCategory,
  ProductCreatePayload,
  ProductDetail,
  ProductListResponse,
  ProductUpdatePayload,
} from './product.model';

export type { ProductCategory, ProductDetail, ProductListItem, ProductListResponse } from './product.model';

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

  create(data: ProductCreatePayload): Observable<ProductDetail> {
    return this.http.post<ProductDetail>(this.apiUrl, data, {
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

  update(id: number, data: ProductUpdatePayload): Observable<ProductDetail> {
    return this.http.put<ProductDetail>(`${this.apiUrl}/${id}`, data, {
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

  categories(id: number, data: { categoryId: number }) {
    return this.http.put(`${this.apiUrl}/${id}/categories`, data, {
      withCredentials: true
    });
  }

  getById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

}
