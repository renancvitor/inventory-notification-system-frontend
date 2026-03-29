import { PaginatedResponse } from '../../../shared/services/pagination.model';

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

export interface OrderUpdatePayload {
  description: string;
  movements: OrderCreateItemPayload[];
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

export type OrderListResponse = PaginatedResponse<OrderDetail>;

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
