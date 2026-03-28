import { ChangeDetectorRef, OnInit, Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  OrderFormComponent,
  OrderFormValue,
} from '../components/form/order-form.component';
import { MovementTypeOption, OrderService, OrderSummary } from '../../services/order.service';
import { ProductListItem, ProductService } from '../../../product/services/product.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [OrderFormComponent],
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
})
export class OrderCreateComponent implements OnInit {

  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(OrderFormComponent) orderFormComponent!: OrderFormComponent;

  loading = false;
  productsLoading = false;
  movementTypesLoading = false;
  products: ProductListItem[] = [];
  movementTypes: MovementTypeOption[] = [];

  ngOnInit() {
    this.loadProducts();
    this.loadMovementTypes();
  }

  createOrder(orderData: OrderFormValue) {
    if (this.loading) {
      return;
    }

    this.setLoading(true);

    this.orderService.create({
      description: orderData.description,
      items: orderData.items.map((item: OrderFormValue['items'][number]) => ({
        productId: item.productId,
        movementTypeId: orderData.movementTypeId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    }).subscribe({
      next: (order) => {
        this.setLoading(false);
        this.orderFormComponent.resetForm();
        this.showSuccessToast(order, orderData.movementTypeName);
      },
      error: () => {
        this.setLoading(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/orders']);
  }

  private loadMovementTypes() {
    this.movementTypesLoading = true;

    this.orderService.listMovementTypes().subscribe({
      next: (movementTypes) => {
        this.movementTypes = movementTypes;
        this.movementTypesLoading = false;
      },
      error: () => {
        this.movementTypesLoading = false;
      }
    });
  }

  private loadProducts() {
    this.productsLoading = true;

    this.productService.list({
      active: true,
      page: 0,
      size: 100,
    }).subscribe({
      next: (response) => {
        this.products = (response.content ?? []).map((product: ProductListItem) => ({
          ...product,
          price: Number(product.price ?? 0),
        }));
        this.productsLoading = false;
      },
      error: () => {
        this.productsLoading = false;
      }
    });
  }

  private showSuccessToast(order: OrderSummary, movementTypeName: string) {
    this.snackBar.openFromComponent(ToastComponent, {
      panelClass: 'app-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: {
        title: 'Cadastro realizado com sucesso',
        name: this.formatOrderId(order.id),
        info: `Registrado agora • ${this.formatPrice(order.totalValue)} • Tipo de pedido: ${order.orderType ?? movementTypeName}`,
        primaryAction: {
          label: 'Cadastrar outro',
          type: 'new'
        },
        secondaryAction: {
          label: 'Voltar para Pedidos',
          type: 'list'
        },
        onAction: (action: string) => {
          if (action === 'list') {
            this.router.navigate(['/orders']);
          }

          if (action === 'new') {
            this.orderFormComponent.resetForm();
          }
        }
      }
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

  private setLoading(value: boolean) {
    this.loading = value;
    this.changeDetectorRef.detectChanges();
  }

}
