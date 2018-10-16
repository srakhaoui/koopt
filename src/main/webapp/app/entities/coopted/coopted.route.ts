import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coopted } from 'app/shared/model/coopted.model';
import { CooptedService } from './coopted.service';
import { CooptedComponent } from './coopted.component';
import { CooptedDetailComponent } from './coopted-detail.component';
import { CooptedUpdateComponent } from './coopted-update.component';
import { CooptedDeletePopupComponent } from './coopted-delete-dialog.component';
import { ICoopted } from 'app/shared/model/coopted.model';

@Injectable({ providedIn: 'root' })
export class CooptedResolve implements Resolve<ICoopted> {
    constructor(private service: CooptedService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((coopted: HttpResponse<Coopted>) => coopted.body));
        }
        return of(new Coopted());
    }
}

export const cooptedRoute: Routes = [
    {
        path: 'coopted',
        component: CooptedComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopteds'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'coopted/:id/view',
        component: CooptedDetailComponent,
        resolve: {
            coopted: CooptedResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopteds'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'coopted/new',
        component: CooptedUpdateComponent,
        resolve: {
            coopted: CooptedResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopteds'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'coopted/:id/edit',
        component: CooptedUpdateComponent,
        resolve: {
            coopted: CooptedResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopteds'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const cooptedPopupRoute: Routes = [
    {
        path: 'coopted/:id/delete',
        component: CooptedDeletePopupComponent,
        resolve: {
            coopted: CooptedResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopteds'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
