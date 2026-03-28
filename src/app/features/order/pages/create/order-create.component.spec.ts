import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { OrderCreateComponent } from './order-create.component';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../../product/services/product.service';

describe('OrderCreateComponent', () => {
  let component: OrderCreateComponent;
  let fixture: ComponentFixture<OrderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCreateComponent],
      providers: [
        provideRouter([]),
        {
          provide: OrderService,
          useValue: {
            listMovementTypes: () => of([]),
            create: () => of({ id: 1, totalValue: 0, orderType: 'Entrada' }),
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

    fixture = TestBed.createComponent(OrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
