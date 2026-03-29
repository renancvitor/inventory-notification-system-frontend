import { PaginatedResponse } from '../../../shared/services/pagination.model';

export interface ProductFormValue {
  productName: string;
  categoryId: number;
  price: number;
  validity: string;
  description: string;
  stock: number;
  minimumStock: number;
  brand: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  displayName: string;
}

export interface ProductListItem {
  id: number;
  productName: string;
  category: string;
  price: number;
  validity?: string;
  description?: string;
  stock: number;
  minimumStock?: number;
  minimumStrock?: number;
  brand: string;
  active: boolean;
}

export interface ProductDetail {
  id: number;
  productName: string;
  category: string;
  price: number;
  validity?: string | null;
  description?: string | null;
  stock: number;
  minimumStock?: number | null;
  brand: string;
}

export type ProductListResponse = PaginatedResponse<ProductListItem>;
export type ProductCreatePayload = ProductFormValue;

export interface ProductUpdatePayload {
  productName: string;
  categoryId: number;
  price: number;
  validity: string | null;
  description: string | null;
  minimumStock: number;
  brand: string;
}
