import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface OrderMovementSummary {
  id?: number;
  productId?: number;
  productName?: string;
  movementType?: string;
  quantity?: number;
  unitPrice?: number;
  movementationDate?: string;
  personName?: string;
}

export interface OrderItemSummary {
  productId?: number;
  productName?: string;
  movementTypeId?: number;
  movementType?: string;
  quantity?: number;
  unitPrice?: number;
  totalValue?: number;
}

export interface MovementTypeOption {
  id: number;
  name: string;
}

export interface OrderCreateItemPayload {
  productId: number;
  movementTypeId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderCreatePayload {
  description: string;
  items: OrderCreateItemPayload[];
}

export interface OrderSummary {
  id: number;
  createdAt?: string;
  totalValue?: number;
  status?: string;
  orderType?: string;
  requestedBy?: string;
  requestedByName?: string | null;
  approvedBy?: string | null;
  approvedByName?: string | null;
  rejectedBy?: string | null;
  rejectedByName?: string | null;
  movements?: OrderMovementSummary[];
}

export interface OrderDetail extends OrderSummary {
  description?: string;
  items?: OrderItemSummary[];
  movements?: OrderMovementSummary[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
}

export interface OrderListParams {
  page?: number;
  size?: number;
  search?: string;
  orderStatusId?: number;
  requestedBy?: number;
  approvedBy?: number;
  rejectedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  totalValue?: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private readonly apiUrl = `${environment.apiUrl}/orders`;
  private readonly movementTypesUrl = `${environment.apiUrl}/movement-types`;
  private movementTypesRequest$?: Observable<MovementTypeOption[]>;

  constructor(private http: HttpClient) {}

  list(params?: OrderListParams): Observable<PaginatedResponse<OrderSummary>> {
    return this.http.get<PaginatedResponse<OrderSummary>>(this.apiUrl, {
      params: {
        ...(params?.page !== undefined && { page: params.page }),
        ...(params?.size !== undefined && { size: params.size }),
        ...(params?.search !== undefined && { search: params.search }),
        ...(params?.orderStatusId !== undefined && { orderStatusId: params.orderStatusId }),
        ...(params?.requestedBy !== undefined && { requestedBy: params.requestedBy }),
        ...(params?.approvedBy !== undefined && { approvedBy: params.approvedBy }),
        ...(params?.rejectedBy !== undefined && { rejectedBy: params.rejectedBy }),
        ...(params?.createdAt !== undefined && { createdAt: params.createdAt }),
        ...(params?.updatedAt !== undefined && { updatedAt: params.updatedAt }),
        ...(params?.totalValue !== undefined && { totalValue: params.totalValue })
      },
      withCredentials: true
    });
  }

  listMovementTypes(forceRefresh = false): Observable<MovementTypeOption[]> {
    if (!this.movementTypesRequest$ || forceRefresh) {
      this.movementTypesRequest$ = this.http.get<MovementTypeOption[]>(this.movementTypesUrl, {
        withCredentials: true
      }).pipe(
        shareReplay(1)
      );
    }

    return this.movementTypesRequest$;
  }

  create(data: OrderCreatePayload): Observable<OrderSummary> {
    return this.http.post<OrderSummary>(this.apiUrl, data, {
      withCredentials: true
    });
  }

  getById(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      withCredentials: true
    });
  }

  reject(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {}, {
      withCredentials: true
    });
  }

  approve(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {}, {
      withCredentials: true
    });
  }

}
