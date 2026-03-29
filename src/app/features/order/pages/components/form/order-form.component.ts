import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { MovementTypeOption } from '../../../services/order.service';
import {
  OrderFormHeaderMeta,
  OrderFormInitialValue,
  OrderFormItemValue,
  OrderFormValue,
  OrderSelectableProduct,
} from '../../../services/order-form.model';

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
  @Output() editRequested = new EventEmitter<void>();
  @Output() approveRequested = new EventEmitter<void>();
  @Output() rejectRequested = new EventEmitter<void>();

  @Input() loading = false;
  @Input() productsLoading = false;
  @Input() products: OrderSelectableProduct[] = [];
  @Input() movementTypes: MovementTypeOption[] = [];
  @Input() title = 'Novo pedido';
  @Input() submitLabel = 'Finalizar pedido';
  @Input() headerMeta: OrderFormHeaderMeta | null = null;
  @Input() showDecisionActions = false;
  @Input() showEditAction = true;

  private _mode: 'create' | 'view' | 'edit' = 'create';
  private _movementTypesLoading = false;
  private _initialValue: OrderFormInitialValue | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly brlFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  private readonly dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  productSearchTerm = '';
  highlightedProductIndex = 0;
  orderItems: OrderFormItemValue[] = [];

  orderForm = this.formBuilder.group({
    movementTypeId: [null as number | null, Validators.required],
    description: ['', Validators.required],
  });

  constructor() {
    this.orderForm.controls.movementTypeId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.productSearchTerm = '';
        this.highlightedProductIndex = 0;
      });
  }

  @Input()
  set initialValue(value: OrderFormInitialValue | null) {
    this._initialValue = value;
    this.patchForm(value);
  }

  get initialValue() {
    return this._initialValue;
  }

  @Input()
  set mode(value: 'create' | 'view' | 'edit') {
    this._mode = value;
    this.syncFormAvailability();
  }

  get mode() {
    return this._mode;
  }

  @Input()
  set movementTypesLoading(value: boolean) {
    this._movementTypesLoading = value;
    this.syncFormAvailability();
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
    if (this.isViewMode) {
      return false;
    }

    return this.orderForm.valid
      && this.orderItems.length > 0
      && this.orderItems.every((item) => item.quantity > 0)
      && !this.loading
      && !this.productsLoading
      && !this.movementTypesLoading;
  }

  get isViewMode() {
    return this.mode === 'view';
  }

  get formattedCreatedAt() {
    if (!this.headerMeta?.createdAt) {
      return '-';
    }

    const date = new Date(this.headerMeta.createdAt);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return this.dateFormatter.format(date);
  }

  onProductSearch(value: string) {
    if (this.isViewMode) {
      return;
    }

    this.productSearchTerm = value;
    this.highlightedProductIndex = 0;
  }

  onProductSearchKeydown(event: KeyboardEvent) {
    if (this.isViewMode) {
      return;
    }

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
    if (this.isViewMode) {
      return;
    }

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
    if (this.isViewMode) {
      return;
    }

    this.orderItems = this.orderItems.filter((item) => item.productId !== productId);
  }

  updateQuantity(productId: number, value: string) {
    if (this.isViewMode) {
      return;
    }

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
    if (this.isViewMode) {
      return;
    }

    const input = event.target as HTMLInputElement | null;
    input?.select();
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
    this.patchForm({
      movementTypeId: null,
      description: '',
      items: [],
    });
  }

  private patchForm(value: OrderFormInitialValue | null) {
    this.orderForm.reset({
      movementTypeId: value?.movementTypeId ?? null,
      description: value?.description ?? '',
    }, { emitEvent: false });

    this.orderItems = (value?.items ?? []).map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: Number(item.quantity ?? 0),
      unitPrice: Number(item.unitPrice ?? 0),
    }));
    this.productSearchTerm = '';
    this.highlightedProductIndex = 0;
    this.syncFormAvailability();
  }

  private syncFormAvailability() {
    if (this.isViewMode) {
      this.orderForm.disable({ emitEvent: false });
      return;
    }

    this.orderForm.enable({ emitEvent: false });

    if (this._movementTypesLoading) {
      this.orderForm.controls.movementTypeId.disable({ emitEvent: false });
    }
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
