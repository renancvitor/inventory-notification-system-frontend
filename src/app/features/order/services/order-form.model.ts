export interface OrderSelectableProduct {
  id: number;
  productName: string;
  brand?: string;
  price: number;
}

export interface OrderFormItemValue {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderFormInitialValue {
  description: string;
  movementTypeId: number | null;
  items: OrderFormItemValue[];
}

export interface OrderFormHeaderMeta {
  orderId?: number | string | null;
  status?: string | null;
  requestedBy?: string | null;
  analyzedBy?: string | null;
  createdAt?: string | null;
}

export interface OrderFormValue {
  description: string;
  movementTypeId: number;
  movementTypeName: string;
  totalValue: number;
  items: OrderFormItemValue[];
}
