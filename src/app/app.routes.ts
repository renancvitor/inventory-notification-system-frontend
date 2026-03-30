import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { catchError, Observable, of } from 'rxjs';

import { LoginComponent } from './features/auth/login/login.component';
import { UpdatePasswordPageComponent } from './features/auth/update-password/update-password-page.component';

import { HomeComponent } from './features/home/home.component';

import { PersonComponent } from './features/person/pages/list/person-list.component';
import { PersonCreateComponent } from './features/person/pages/create/person-create.component';
import { PersonEditComponent } from './features/person/pages/edit/person-edit.component';

import { UserListComponent } from './features/user/pages/list/user-list.component';
import { UserEditComponent } from './features/user/pages/edit/user-edit.component';

import { ProductListComponent } from './features/product/pages/list/product-list.component';
import { ProductCreateComponent } from './features/product/pages/create/product-create.component';
import { ProductEditComponent } from './features/product/pages/edit/product-edit.component';
import { ProductService } from './features/product/services/product.service';

import { OrderListComponent } from './features/order/pages/list/order-list.component';
import { OrderCreateComponent } from './features/order/pages/create/order-create.component';
import { OrderEditComponent } from './features/order/pages/edit/order-edit.component';
import { OrderService } from './features/order/services/order.service';

const redirectOnResolverError = <T>(
    resolver: (route: ActivatedRouteSnapshot) => Observable<T>,
    redirectTo: string,
): ResolveFn<T | RedirectCommand> => {
    return (route) => {
        const router = inject(Router);

        return resolver(route).pipe(
            catchError(() => of(new RedirectCommand(router.parseUrl(redirectTo))))
        );
    };
};

export const productCategoriesResolver = redirectOnResolverError(
    () => inject(ProductService).listCategories(),
    '/products',
);

export const productResolver = redirectOnResolverError(
    (route: ActivatedRouteSnapshot) => inject(ProductService).getById(Number(route.paramMap.get('id'))),
    '/products',
);

export const orderResolver = redirectOnResolverError(
    (route: ActivatedRouteSnapshot) => inject(OrderService).getById(Number(route.paramMap.get('id'))),
    '/orders',
);

export const orderMovementTypesResolver = redirectOnResolverError(
    () => inject(OrderService).listMovementTypes(),
    '/orders',
);

export const activeProductsResolver = redirectOnResolverError(
    () => inject(ProductService).list({
        active: true,
        page: 0,
        size: 100,
    }),
    '/orders',
);

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent,
    },

    {
        path: '',
        canActivate: [authGuard],
        component: HomeComponent
    },

    {
        path: 'update-password',
        canActivate: [authGuard],
        component: UpdatePasswordPageComponent
    },

    {
        path: 'person',
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['ADMIN'],
        },
        component: PersonComponent
    },

    {
        path: 'person/create',
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['ADMIN'],
        },
        component: PersonCreateComponent
    },

    {
        path: 'person/edit/:id',
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['ADMIN'],
        },
        component: PersonEditComponent
    },

    {
        path: 'users',
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['ADMIN'],
        },
        component: UserListComponent
    },

    {
        path: 'users/:id',
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['ADMIN'],
        },
        component: UserEditComponent
    },

    {
        path: 'products',
        canActivate: [authGuard],
        component: ProductListComponent
    },

    {
        path: 'products/create',
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['ADMIN', 'PRODUCT_MANAGER'],
        },
        resolve: {
            categories: productCategoriesResolver,
        },
        component: ProductCreateComponent
    },

    {
        path: 'products/edit/:id',
        canActivate: [authGuard],
        data: {
            allowedUserTypes: ['ADMIN', 'PRODUCT_MANAGER'],
        },
        resolve: {
            product: productResolver,
            categories: productCategoriesResolver,
        },
        component: ProductEditComponent
    },

    {
        path: 'orders',
        canActivate: [authGuard],
        component: OrderListComponent
    },

    {
        path: 'orders/create',
        canActivate: [authGuard],
        component: OrderCreateComponent
    },

    {
        path: 'orders/:id',
        canActivate: [authGuard],
        resolve: {
            order: orderResolver,
            movementTypes: orderMovementTypesResolver,
            products: activeProductsResolver,
        },
        component: OrderEditComponent
    },

    {
        path: '**',
        redirectTo: ''
    }

];
