import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { MovementTypeOption } from '../../../services/order.service';

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

export interface OrderFormValue {
  description: string;
  movementTypeId: number;
  movementTypeName: string;
  totalValue: number;
  items: OrderFormItemValue[];
}

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, ButtonComponent],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent {

  @Output() submitForm = new EventEmitter<OrderFormValue>(true);
  @Output() cancel = new EventEmitter<void>();
  @Input() loading = false;
  @Input() productsLoading = false;
  @Input() products: OrderSelectableProduct[] = [];
  @Input() movementTypes: MovementTypeOption[] = [];
  @Input() title = 'Novo pedido';

  private _movementTypesLoading = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly brlFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  productSearchTerm = '';
  highlightedProductIndex = 0;
  orderItems: OrderFormItemValue[] = [];

  orderForm = this.formBuilder.group({
    movementTypeId: [null as number | null, Validators.required],
    description: ['', Validators.required],
  });

  @Input()
  set movementTypesLoading(value: boolean) {
    this._movementTypesLoading = value;

    if (value) {
      this.orderForm.controls.movementTypeId.disable({ emitEvent: false });
      return;
    }

    this.orderForm.controls.movementTypeId.enable({ emitEvent: false });
  }

  get movementTypesLoading() {
    return this._movementTypesLoading;
  }

  get filteredProducts() {
    const normalizedTerm = this.normalizeText(this.productSearchTerm);

    return this.products
      .filter((product) => !this.orderItems.some((item) => item.productId === product.id))
      .filter((product) => {
        if (!normalizedTerm) {
          return true;
        }

        return this.normalizeText(`${product.id} ${product.productName} ${product.brand ?? ''}`).includes(normalizedTerm);
      })
      .slice(0, 6);
  }

  get totalValue() {
    return this.orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  }

  get isMovementTypeSelected() {
    return this.orderForm.controls.movementTypeId.value !== null;
  }

  get canSubmit() {
    return this.orderForm.valid
      && this.orderItems.length > 0
      && this.orderItems.every((item) => item.quantity > 0)
      && !this.loading
      && !this.productsLoading
      && !this.movementTypesLoading;
  }

  onProductSearch(value: string) {
    this.productSearchTerm = value;
    this.highlightedProductIndex = 0;
  }

  onProductSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveHighlightedProduct(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveHighlightedProduct(-1);
      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (!this.isMovementTypeSelected) {
      return;
    }

    const firstProduct = this.filteredProducts[this.highlightedProductIndex] ?? this.filteredProducts[0];

    if (!firstProduct) {
      return;
    }

    this.addProduct(firstProduct);
  }

  addProduct(product: OrderSelectableProduct) {
    const existingItem = this.orderItems.find((item) => item.productId === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, String(existingItem.quantity + 1));
      this.productSearchTerm = '';
      this.highlightedProductIndex = 0;
      return;
    }

    this.orderItems = [
      ...this.orderItems,
      {
        productId: product.id,
        productName: product.productName,
        quantity: 1,
        unitPrice: Number(product.price),
      },
    ];

    this.productSearchTerm = '';
    this.highlightedProductIndex = 0;
  }

  removeItem(productId: number) {
    this.orderItems = this.orderItems.filter((item) => item.productId !== productId);
  }

  updateQuantity(productId: number, value: string) {
    const targetItem = this.orderItems.find((item) => item.productId === productId);

    if (!targetItem) {
      return;
    }

    if (value.trim() === '') {
      targetItem.quantity = 0;
      return;
    }

    const parsedValue = Number(value);
    targetItem.quantity = Number.isNaN(parsedValue) || parsedValue < 0 ? 0 : Math.floor(parsedValue);
  }

  selectQuantityInput(event: FocusEvent) {
    const input = event.target as HTMLInputElement | null;
    input?.select();
  }

  setMovementType(value: string) {
    this.orderForm.controls.movementTypeId.setValue(value ? Number(value) : null);
    this.productSearchTerm = '';
    this.highlightedProductIndex = 0;
  }

  getMovementTypeName() {
    const movementTypeId = this.orderForm.controls.movementTypeId.value;

    return this.movementTypes.find((item) => item.id === movementTypeId)?.name ?? '-';
  }

  formatCurrency(value: number | string | null | undefined) {
    const numericValue = Number(value);

    if (value === null || value === undefined || Number.isNaN(numericValue)) {
      return this.brlFormatter.format(0);
    }

    return this.brlFormatter.format(numericValue);
  }

  getItemTotal(item: OrderFormItemValue) {
    return item.quantity * item.unitPrice;
  }

  isHighlightedProduct(productId: number) {
    return this.filteredProducts[this.highlightedProductIndex]?.id === productId;
  }

  trackByProductId(_: number, item: OrderFormItemValue) {
    return item.productId;
  }

  onSubmit() {
    if (!this.canSubmit) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const formValue = this.orderForm.getRawValue();

    this.submitForm.emit({
      description: (formValue.description ?? '').trim(),
      movementTypeId: Number(formValue.movementTypeId),
      movementTypeName: this.getMovementTypeName(),
      totalValue: this.totalValue,
      items: this.orderItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
  }

  resetForm() {
    this.orderForm.reset({
      movementTypeId: null,
      description: '',
    });
    this.orderItems = [];
    this.productSearchTerm = '';
  }

  private normalizeText(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private moveHighlightedProduct(step: number) {
    if (!this.filteredProducts.length) {
      return;
    }

    const lastIndex = this.filteredProducts.length - 1;
    const nextIndex = this.highlightedProductIndex + step;

    if (nextIndex < 0) {
      this.highlightedProductIndex = lastIndex;
      return;
    }

    if (nextIndex > lastIndex) {
      this.highlightedProductIndex = 0;
      return;
    }

    this.highlightedProductIndex = nextIndex;
  }

}
