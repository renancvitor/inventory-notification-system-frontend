import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should aggregate all pages when listing orders with local filters', () => {
    let result: unknown;

    service.listAll({ search: 'pedido' }).subscribe((orders) => {
      result = orders;
    });

    const firstRequest = httpMock.expectOne((request) =>
      request.method === 'GET' &&
      request.url.includes('/orders') &&
      request.params.get('page') === '0' &&
      request.params.get('size') === '100' &&
      request.params.get('search') === 'pedido'
    );

    firstRequest.flush({
      content: [{ id: 1 }, { id: 2 }],
      totalElements: 101,
    });

    const secondRequest = httpMock.expectOne((request) =>
      request.method === 'GET' &&
      request.url.includes('/orders') &&
      request.params.get('page') === '1' &&
      request.params.get('size') === '100' &&
      request.params.get('search') === 'pedido'
    );

    secondRequest.flush({
      content: [{ id: 3 }],
      totalElements: 101,
    });

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});
