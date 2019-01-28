import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { PasswordComponent } from './password.component';

export const passwordRoute: Route = {
    path: 'password',
    component: PasswordComponent,
    data: {
        authorities: ['ROLE_COOPTER', 'ROLE_RECRUTER'],
        pageTitle: 'Password'
    },
    canActivate: [UserRouteAccessService]
};
