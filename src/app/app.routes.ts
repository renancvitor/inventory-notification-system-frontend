import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';

import { PersonComponent } from './features/person/pages/list/person-list.component';
import { PersonCreateComponent } from './features/person/pages/create/person-create.component';
import { PersonEditComponent } from './features/person/pages/edit/person-edit.component';

import { UserListComponent } from './features/user/pages/list/user-list.component';
import { UserEditComponent } from './features/user/pages/edit/user-edit.component';

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
        path: 'person',
        canActivate: [authGuard],
        component: PersonComponent
    },

    {
        path: 'person/create',
        canActivate: [authGuard],
        component: PersonCreateComponent
    },

    {
        path: 'person/edit/:id',
        canActivate: [authGuard],
        component: PersonEditComponent
    },

    {
        path: 'users',
        canActivate: [authGuard],
        component: UserListComponent
    },

    {
        path: 'users/:id',
        canActivate: [authGuard],        component: UserEditComponent
    },

    {
        path: '**',
        redirectTo: ''
    }

];
