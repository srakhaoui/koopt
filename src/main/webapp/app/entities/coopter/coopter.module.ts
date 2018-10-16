import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CooptitSharedModule } from 'app/shared';
import { CooptitAdminModule } from 'app/admin/admin.module';
import {
    CoopterComponent,
    CoopterDetailComponent,
    CoopterUpdateComponent,
    CoopterDeletePopupComponent,
    CoopterDeleteDialogComponent,
    coopterRoute,
    coopterPopupRoute
} from './';

const ENTITY_STATES = [...coopterRoute, ...coopterPopupRoute];

@NgModule({
    imports: [CooptitSharedModule, CooptitAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CoopterComponent,
        CoopterDetailComponent,
        CoopterUpdateComponent,
        CoopterDeleteDialogComponent,
        CoopterDeletePopupComponent
    ],
    entryComponents: [CoopterComponent, CoopterUpdateComponent, CoopterDeleteDialogComponent, CoopterDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CooptitCoopterModule {}
