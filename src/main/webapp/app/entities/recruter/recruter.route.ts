import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recruter } from 'app/shared/model/recruter.model';
import { RecruterService } from './recruter.service';
import { RecruterComponent } from './recruter.component';
import { RecruterDetailComponent } from './recruter-detail.component';
import { RecruterUpdateComponent } from './recruter-update.component';
import { RecruterDeletePopupComponent } from './recruter-delete-dialog.component';
import { IRecruter } from 'app/shared/model/recruter.model';

@Injectable({ providedIn: 'root' })
export class RecruterResolve implements Resolve<IRecruter> {
    constructor(private service: RecruterService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((recruter: HttpResponse<Recruter>) => recruter.body));
        }
        return of(new Recruter());
    }
}

export const recruterRoute: Routes = [
    {
        path: 'recruter',
        component: RecruterComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recruters'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'recruter/:id/view',
        component: RecruterDetailComponent,
        resolve: {
            recruter: RecruterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recruters'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'recruter/new',
        component: RecruterUpdateComponent,
        resolve: {
            recruter: RecruterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recruters'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'recruter/:id/edit',
        component: RecruterUpdateComponent,
        resolve: {
            recruter: RecruterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recruters'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const recruterPopupRoute: Routes = [
    {
        path: 'recruter/:id/delete',
        component: RecruterDeletePopupComponent,
        resolve: {
            recruter: RecruterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recruters'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
