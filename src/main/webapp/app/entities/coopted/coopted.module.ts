import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CooptitSharedModule } from 'app/shared';
import { CooptitAdminModule } from 'app/admin/admin.module';
import {
    CooptedComponent,
    CooptedDetailComponent,
    CooptedUpdateComponent,
    CooptedDeletePopupComponent,
    CooptedDeleteDialogComponent,
    cooptedRoute,
    cooptedPopupRoute
} from './';

const ENTITY_STATES = [...cooptedRoute, ...cooptedPopupRoute];

@NgModule({
    imports: [CooptitSharedModule, CooptitAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CooptedComponent,
        CooptedDetailComponent,
        CooptedUpdateComponent,
        CooptedDeleteDialogComponent,
        CooptedDeletePopupComponent
    ],
    entryComponents: [CooptedComponent, CooptedUpdateComponent, CooptedDeleteDialogComponent, CooptedDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CooptitCooptedModule {}
