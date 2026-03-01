import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent,
    },

    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/home/home.component').then((m) => m.HomeComponent),
    },

    {
        path: '**',
        redirectTo: ''
    }

];
