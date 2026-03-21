import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { errorInterceptor } from './core/errors/error.interceptor';

import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/http/credentials.interceptor';
import { getPortuguesePaginatorIntl } from './shared/paginator-intl';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    { provide: MatPaginatorIntl, useFactory: getPortuguesePaginatorIntl }
  ],
};
