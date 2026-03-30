import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, RouterStateSnapshot, convertToParamMap, provideRouter } from '@angular/router';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { routes } from './app.routes';
import { OrderService } from './features/order/services/order.service';
import { ProductService } from './features/product/services/product.service';

describe('app.routes resolvers', () => {
  const productService = {
    getById: vi.fn(),
    list: vi.fn(),
    listCategories: vi.fn(),
  };
  const orderService = {
    getById: vi.fn(),
    listMovementTypes: vi.fn(),
  };

  const executeResolver = async <T>(resolver: Function, route: ActivatedRouteSnapshot) => {
    const result = TestBed.runInInjectionContext(() =>
      resolver(route, {} as RouterStateSnapshot)
    );

    return isObservable(result) ? firstValueFrom(result) : result as T;
  };

  beforeEach(() => {
    productService.getById.mockReset();
    productService.list.mockReset();
    productService.listCategories.mockReset();
    orderService.getById.mockReset();
    orderService.listMovementTypes.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productService },
        { provide: OrderService, useValue: orderService },
      ],
    });
  });

  it('should redirect to products when product preload fails', async () => {
    productService.getById.mockReturnValue(throwError(() => new Error('boom')));

    const route = {
      paramMap: convertToParamMap({ id: '10' }),
    } as ActivatedRouteSnapshot;

    const productEditRoute = routes.find((item) => item.path === 'products/edit/:id');
    const result = await executeResolver<RedirectCommand>(productEditRoute!.resolve!['product']!, route);

    expect(result).toBeInstanceOf(RedirectCommand);
  });

  it('should redirect to orders when order preload fails', async () => {
    orderService.getById.mockReturnValue(throwError(() => new Error('boom')));

    const route = {
      paramMap: convertToParamMap({ id: '15' }),
    } as ActivatedRouteSnapshot;

    const orderEditRoute = routes.find((item) => item.path === 'orders/:id');
    const result = await executeResolver<RedirectCommand>(orderEditRoute!.resolve!['order']!, route);

    expect(result).toBeInstanceOf(RedirectCommand);
  });

  it('should preload active products for order editing', async () => {
    productService.list.mockReturnValue(of({
      content: [{ id: 1 }],
      totalElements: 1,
    }));

    const orderEditRoute = routes.find((item) => item.path === 'orders/:id');
    const result = await executeResolver(orderEditRoute!.resolve!['products']!, {} as ActivatedRouteSnapshot);

    expect(result).toEqual({
      content: [{ id: 1 }],
      totalElements: 1,
    });
    expect(productService.list).toHaveBeenCalledWith({
      active: true,
      page: 0,
      size: 100,
    });
  });
});
