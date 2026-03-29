import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { OrderEditComponent } from './order-edit.component';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../../product/services/product.service';

describe('OrderEditComponent', () => {
  let component: OrderEditComponent;
  let fixture: ComponentFixture<OrderEditComponent>;

  beforeEach(async () => {
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
          useValue: {
            getById: () => of({
              id: 1,
              status: 'Pendente',
              orderType: 'Entrada',
              items: [],
            }),
            listMovementTypes: () => of([]),
            update: () => of({ id: 1, status: 'Pendente', orderType: 'Entrada', movements: [] }),
            approve: () => of({ id: 1, status: 'Aprovado', orderType: 'Entrada', movements: [] }),
            reject: () => of({ id: 1, status: 'Reprovado', orderType: 'Entrada', movements: [] }),
          },
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
});
