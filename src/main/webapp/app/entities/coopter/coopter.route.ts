import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coopter } from 'app/shared/model/coopter.model';
import { CoopterService } from './coopter.service';
import { CoopterComponent } from './coopter.component';
import { CoopterDetailComponent } from './coopter-detail.component';
import { CoopterUpdateComponent } from './coopter-update.component';
import { CoopterDeletePopupComponent } from './coopter-delete-dialog.component';
import { ICoopter } from 'app/shared/model/coopter.model';

@Injectable({ providedIn: 'root' })
export class CoopterResolve implements Resolve<ICoopter> {
    constructor(private service: CoopterService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((coopter: HttpResponse<Coopter>) => coopter.body));
        }
        return of(new Coopter());
    }
}

export const coopterRoute: Routes = [
    {
        path: 'coopter',
        component: CoopterComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'Coopters'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'coopter/:id/view',
        component: CoopterDetailComponent,
        resolve: {
            coopter: CoopterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopters'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'coopter/new',
        component: CoopterUpdateComponent,
        resolve: {
            coopter: CoopterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopters'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'coopter/:id/edit',
        component: CoopterUpdateComponent,
        resolve: {
            coopter: CoopterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopters'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const coopterPopupRoute: Routes = [
    {
        path: 'coopter/:id/delete',
        component: CoopterDeletePopupComponent,
        resolve: {
            coopter: CoopterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Coopters'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
