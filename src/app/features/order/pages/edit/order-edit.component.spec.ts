import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { OrderEditComponent } from './order-edit.component';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../../product/services/product.service';

describe('OrderEditComponent', () => {
  let component: OrderEditComponent;
  let fixture: ComponentFixture<OrderEditComponent>;
  const orderService = {
    getById: vi.fn(),
    listMovementTypes: vi.fn(),
    update: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
  };

  beforeEach(async () => {
    orderService.getById.mockReturnValue(of({
      id: 1,
      status: 'Pendente',
      orderType: 'Entrada',
      items: [],
    }));
    orderService.listMovementTypes.mockReturnValue(of([]));
    orderService.update.mockReturnValue(of({
      id: 1,
      status: 'Pendente',
      orderType: 'Entrada',
      description: 'Pedido atualizado',
      items: [],
      movements: [],
    }));
    orderService.approve.mockReturnValue(of({ id: 1, status: 'Aprovado', orderType: 'Entrada', movements: [] }));
    orderService.reject.mockReturnValue(of({ id: 1, status: 'Reprovado', orderType: 'Entrada', movements: [] }));

    await TestBed.configureTestingModule({
      imports: [OrderEditComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
              data: {
                order: {
                  id: 1,
                  status: 'Pendente',
                  orderType: 'Entrada',
                  items: [],
                },
                movementTypes: [],
                products: {
                  content: [],
                },
              },
            },
          },
        },
        {
          provide: OrderService,
          useValue: orderService,
        },
        {
          provide: ProductService,
          useValue: {
            list: () => of({ content: [] }),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            openFromComponent: () => undefined,
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send movements payload when saving order changes', () => {
    orderService.update.mockClear();

    component.saveOrder({
      description: 'Pedido atualizado',
      movementTypeId: 1,
      movementTypeName: 'Entrada',
      totalValue: 40,
      items: [
        {
          productId: 10,
          productName: 'Produto 10',
          quantity: 2,
          unitPrice: 20,
        },
      ],
    });

    expect(orderService.update).toHaveBeenCalledWith(1, {
      description: 'Pedido atualizado',
      movements: [
        {
          productId: 10,
          movementTypeId: 1,
          quantity: 2,
          unitPrice: 20,
        },
      ],
    });
  });
});
