import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cooptation } from 'app/shared/model/cooptation.model';
import { CooptationService } from './cooptation.service';
import { CooptationComponent } from './cooptation.component';
import { CooptationDetailComponent } from './cooptation-detail.component';
import { CooptationUpdateComponent } from './cooptation-update.component';
import { CooptationDeletePopupComponent } from './cooptation-delete-dialog.component';
import { ICooptation } from 'app/shared/model/cooptation.model';

@Injectable({ providedIn: 'root' })
export class CooptationResolve implements Resolve<ICooptation> {
    constructor(private service: CooptationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((cooptation: HttpResponse<Cooptation>) => cooptation.body));
        }
        return of(new Cooptation());
    }
}

export const cooptationRoute: Routes = [
    {
        path: 'cooptation',
        component: CooptationComponent,
        data: {
            authorities: ['ROLE_COOPTER', 'ROLE_RECRUTER'],
            pageTitle: 'Cooptations'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'cooptation/:id/view',
        component: CooptationDetailComponent,
        resolve: {
            cooptation: CooptationResolve
        },
        data: {
            authorities: ['ROLE_COOPTER', 'ROLE_RECRUTER'],
            pageTitle: 'Cooptations'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'cooptation/new',
        component: CooptationUpdateComponent,
        resolve: {
            cooptation: CooptationResolve
        },
        data: {
            authorities: ['ROLE_COOPTER', 'ROLE_RECRUTER'],
            pageTitle: 'Cooptations'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'cooptation/:id/edit',
        component: CooptationUpdateComponent,
        resolve: {
            cooptation: CooptationResolve
        },
        data: {
            authorities: ['ROLE_COOPTER', 'ROLE_RECRUTER'],
            pageTitle: 'Cooptations'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const cooptationPopupRoute: Routes = [
    {
        path: 'cooptation/:id/delete',
        component: CooptationDeletePopupComponent,
        resolve: {
            cooptation: CooptationResolve
        },
        data: {
            authorities: ['ROLE_COOPTER', 'ROLE_RECRUTER'],
            pageTitle: 'Cooptations'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
