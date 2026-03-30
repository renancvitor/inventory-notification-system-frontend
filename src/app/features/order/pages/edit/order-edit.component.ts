import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  OrderFormComponent,
} from '../components/form/order-form.component';
import {
  MovementTypeOption,
  OrderDetail,
  OrderItemSummary,
  OrderService,
} from '../../services/order.service';
import { OrderFormInitialValue, OrderFormValue } from '../../services/order-form.model';
import { ProductListItem, ProductService } from '../../../product/services/product.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { AuthService } from '../../../../core/auth/auth.service';

  @Component({
  selector: 'app-order-edit.component',
  standalone: true,
  imports: [CommonModule, OrderFormComponent],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);

  id = 0;
  loading = false;
  orderLoading = false;
  productsLoading = false;
  movementTypesLoading = false;
  products: ProductListItem[] = [];
  movementTypes: MovementTypeOption[] = [];
  order: OrderDetail | null = null;
  formValue: OrderFormInitialValue | null = null;
  mode: 'view' | 'edit' = 'view';

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.order = this.route.snapshot.data['order'] ?? null;
    this.movementTypes = this.route.snapshot.data['movementTypes'] ?? [];
    this.products = ((this.route.snapshot.data['products']?.content ?? []) as ProductListItem[]).map((product) => ({
      ...product,
      price: Number(product.price ?? 0),
    }));

    this.setOrderState(this.order);
  }

  get pageTitle() {
    if (!this.order) {
      return 'Detalhes do pedido';
    }

    return this.mode === 'view' ? 'Detalhes do pedido' : 'Editar pedido';
  }

  get submitLabel() {
    return 'Salvar alterações';
  }

  get headerMeta() {
    if (!this.order) {
      return null;
    }

    return {
      orderId: this.order.id,
      status: this.order.status,
      requestedBy: this.order.requestedByName || this.order.requestedBy,
      analyzedBy: this.getAnalyzedBy(this.order),
      createdAt: this.order.createdAt,
    };
  }

  get showDecisionActions() {
    return this.mode === 'view'
      && this.authService.canReviewOrders()
      && this.isPendingStatus(this.order?.status)
      && !this.orderLoading;
  }

  saveOrder(orderData: OrderFormValue) {
    if (this.loading) {
      return;
    }

    this.setLoading(true);

    this.orderService.update(this.id, {
      description: orderData.description,
      movements: orderData.items.map((item) => ({
        productId: item.productId,
        movementTypeId: orderData.movementTypeId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    }).subscribe({
      next: (order: OrderDetail) => {
        this.setLoading(false);
        this.mode = 'view';
        this.setOrderState(order);
        this.showToast('Pedido atualizado com sucesso', order);
      },
      error: () => {
        this.setLoading(false);
      },
    });
  }

  enableEditMode() {
    if (!this.canEditOrder) {
      return;
    }

    this.mode = 'edit';
  }

  get canEditOrder() {
    return this.hasRenderableItems && this.authService.canEditOrder(this.order);
  }

  get hasRenderableItems() {
    return (this.order?.items?.length ?? 0) > 0;
  }

  cancel() {
    if (this.mode === 'edit') {
      this.mode = 'view';
      this.formValue = this.cloneFormValue(this.buildFormValue(this.order));
      return;
    }

    this.router.navigate(['/orders']);
  }

  approveOrder() {
    if (this.loading || !this.order) {
      return;
    }

    this.setLoading(true);

    this.orderService.approve(this.id).subscribe({
      next: (order: OrderDetail) => {
        this.setLoading(false);
        this.setOrderState(order);
        this.showToast('Pedido aprovado com sucesso', order);
      },
      error: () => {
        this.setLoading(false);
      },
    });
  }

  rejectOrder() {
    if (this.loading || !this.order) {
      return;
    }

    this.setLoading(true);

    this.orderService.reject(this.id).subscribe({
      next: (order: OrderDetail) => {
        this.setLoading(false);
        this.setOrderState(order);
        this.showToast('Pedido reprovado com sucesso', order);
      },
      error: () => {
        this.setLoading(false);
      },
    });
  }

  private setOrderState(order: OrderDetail | null) {
    if (!order) {
      this.order = null;
      this.formValue = null;
      return;
    }

    this.order = {
      ...order,
      items: this.normalizeItems(order.items),
      status: order.status || '-',
    };
    this.formValue = this.cloneFormValue(this.buildFormValue(this.order));
  }

  private buildFormValue(order: OrderDetail | null): OrderFormInitialValue {
    return {
      description: order?.description ?? '',
      movementTypeId: this.resolveMovementTypeId(order),
      items: this.normalizeItems(order?.items).map((item) => ({
        productId: Number(item.productId ?? 0),
        productName: item.productName || `Produto #${item.productId ?? '-'}`,
        quantity: Number(item.quantity ?? 0),
        unitPrice: Number(item.unitPrice ?? 0),
      })),
    };
  }

  private resolveMovementTypeId(order: OrderDetail | null) {
    if (!order) {
      return null;
    }

    const itemMovementTypeId = order.items?.[0]?.movementTypeId;
    if (itemMovementTypeId !== undefined && itemMovementTypeId !== null) {
      return Number(itemMovementTypeId);
    }

    const movementTypeName = (order.orderType || order.movements?.[0]?.movementType || '').trim().toLowerCase();
    const match = this.movementTypes.find((item) => item.name.trim().toLowerCase() === movementTypeName);

    return match?.id ?? null;
  }

  private normalizeItems(items: OrderItemSummary[] | undefined) {
    return (items ?? []).map((item) => ({
      ...item,
      productId: Number(item.productId ?? 0),
      movementTypeId: Number(item.movementTypeId ?? 0),
      productName: item.productName || `Produto #${item.productId ?? '-'}`,
      quantity: Number(item.quantity ?? 0),
      unitPrice: Number(item.unitPrice ?? 0),
    }));
  }

  private isPendingStatus(status: string | undefined) {
    return (status || '').trim().toLowerCase() === 'pendente';
  }

  private getAnalyzedBy(order: OrderDetail) {
    return order.approvedByName || order.rejectedByName || order.approvedBy || order.rejectedBy || '-';
  }

  private showToast(title: string, order: OrderDetail) {
    this.snackBar.openFromComponent(ToastComponent, {
      panelClass: 'app-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: {
        title,
        name: this.formatOrderId(order.id),
        info: `${order.orderType ?? '-'} • ${this.formatPrice(order.totalValue)} • Status: ${order.status ?? '-'}`,
        primaryAction: {
          label: 'Voltar para Pedidos',
          type: 'list',
        },
        secondaryAction: null,
        onAction: (action: string) => {
          if (action === 'list') {
            this.router.navigate(['/orders']);
          }
        },
      },
    });
  }

  private formatOrderId(value: number | undefined) {
    const numericValue = Number(value);

    if (value === undefined || Number.isNaN(numericValue)) {
      return '-';
    }

    return new Intl.NumberFormat('pt-BR').format(numericValue);
  }

  private formatPrice(value: number | string | undefined) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));
  }

  private cloneFormValue(value: OrderFormInitialValue) {
    return {
      description: value.description,
      movementTypeId: value.movementTypeId,
      items: value.items.map((item) => ({ ...item })),
    };
  }

  private setLoading(value: boolean) {
    this.loading = value;
    this.changeDetectorRef.detectChanges();
  }

}
