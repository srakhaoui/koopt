import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CooptitSharedModule } from 'app/shared';
import { CooptitAdminModule } from 'app/admin/admin.module';
import {
    RecruterComponent,
    RecruterDetailComponent,
    RecruterUpdateComponent,
    RecruterDeletePopupComponent,
    RecruterDeleteDialogComponent,
    recruterRoute,
    recruterPopupRoute
} from './';

const ENTITY_STATES = [...recruterRoute, ...recruterPopupRoute];

@NgModule({
    imports: [CooptitSharedModule, CooptitAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        RecruterComponent,
        RecruterDetailComponent,
        RecruterUpdateComponent,
        RecruterDeleteDialogComponent,
        RecruterDeletePopupComponent
    ],
    entryComponents: [RecruterComponent, RecruterUpdateComponent, RecruterDeleteDialogComponent, RecruterDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CooptitRecruterModule {}
