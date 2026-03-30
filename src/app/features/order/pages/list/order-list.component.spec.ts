import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../services/order.service';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let orderServiceSpy: {
    list: ReturnType<typeof vi.fn>;
    listAll: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    orderServiceSpy = {
      list: vi.fn(),
      listAll: vi.fn(),
    };
    orderServiceSpy.list.mockReturnValue(of({
      content: [],
      totalElements: 0,
    }));
    orderServiceSpy.listAll.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [
        provideRouter([]),
        {
          provide: OrderService,
          useValue: orderServiceSpy,
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request paginated orders when there are no local filters', () => {
    orderServiceSpy.list.mockClear();
    orderServiceSpy.list.mockReturnValue(of({
      content: [
        { id: 1, orderType: 'Entrada' },
        { id: 2, orderType: 'Saida' },
      ],
      totalElements: 2,
    }));

    component.filter.status = 'all';
    component.loadOrders();

    expect(orderServiceSpy.list).toHaveBeenCalledWith(expect.objectContaining({
      search: undefined,
    }));
    expect(orderServiceSpy.listAll).not.toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalOrders).toBe(2);
  });

  it('should load all matching orders and paginate locally when a status filter is active', () => {
    orderServiceSpy.list.mockClear();
    orderServiceSpy.listAll.mockClear();
    orderServiceSpy.listAll.mockReturnValue(of([
      { id: 1, status: 'Aprovado', orderType: 'Entrada' },
      { id: 2, status: 'Aprovado', orderType: 'Saida' },
      { id: 3, status: 'Pendente', orderType: 'Entrada' },
    ]));

    component.filter.status = 'approved';
    component.loadOrders();

    expect(orderServiceSpy.listAll).toHaveBeenCalledWith({
      search: undefined,
    });
    expect(orderServiceSpy.list).not.toHaveBeenCalled();
    expect(component.totalOrders).toBe(2);
    expect(component.dataSource.data.map((order) => order.id)).toEqual([1, 2]);
  });
});
