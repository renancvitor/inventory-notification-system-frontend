import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, expand, reduce, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  MovementTypeOption,
  OrderCreatePayload,
  OrderDetail,
  OrderListParams,
  OrderListResponse,
  OrderSummary,
  OrderUpdatePayload,
} from './order.model';

export type {
  MovementTypeOption,
  OrderCreateItemPayload,
  OrderCreatePayload,
  OrderDetail,
  OrderItemSummary,
  OrderListParams,
  OrderMovementSummary,
  OrderSummary,
  OrderUpdatePayload,
} from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private readonly apiUrl = `${environment.apiUrl}/orders`;
  private readonly movementTypesUrl = `${environment.apiUrl}/movement-types`;
  private readonly fullListPageSize = 100;
  private movementTypesRequest$?: Observable<MovementTypeOption[]>;

  constructor(private http: HttpClient) {}

  list(params?: OrderListParams): Observable<OrderListResponse> {
    return this.http.get<OrderListResponse>(this.apiUrl, {
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

  listAll(params?: Omit<OrderListParams, 'page' | 'size' | 'orderStatusId'>): Observable<OrderSummary[]> {
    const requestParams = {
      ...params,
      page: 0,
      size: this.fullListPageSize,
    };

    return this.list(requestParams).pipe(
      expand((response, index) => {
        const totalPages = Math.ceil((response.totalElements ?? 0) / this.fullListPageSize);
        const nextPage = index + 1;

        if (nextPage >= totalPages) {
          return EMPTY;
        }

        return this.list({
          ...requestParams,
          page: nextPage,
          size: this.fullListPageSize,
        });
      }),
      reduce((orders, response) => {
        orders.push(...(response.content ?? []));
        return orders;
      }, [] as OrderSummary[])
    );
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

  update(id: number, data: OrderUpdatePayload): Observable<OrderDetail> {
    return this.http.put<OrderDetail>(`${this.apiUrl}/${id}`, data, {
      withCredentials: true
    });
  }

  reject(id: number): Observable<OrderDetail> {
    return this.http.put<OrderDetail>(`${this.apiUrl}/${id}/reject`, {}, {
      withCredentials: true
    });
  }

  approve(id: number): Observable<OrderDetail> {
    return this.http.put<OrderDetail>(`${this.apiUrl}/${id}/approve`, {}, {
      withCredentials: true
    });
  }

}
