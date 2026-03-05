import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';

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
        path: '**',
        redirectTo: ''
    }

];
