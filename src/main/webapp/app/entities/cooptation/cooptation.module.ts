import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CooptitSharedModule } from 'app/shared';
import {
    CooptationComponent,
    CooptationDetailComponent,
    CooptationUpdateComponent,
    CooptationDeletePopupComponent,
    CooptationDeleteDialogComponent,
    cooptationRoute,
    cooptationPopupRoute
} from './';

const ENTITY_STATES = [...cooptationRoute, ...cooptationPopupRoute];

@NgModule({
    imports: [CooptitSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CooptationComponent,
        CooptationDetailComponent,
        CooptationUpdateComponent,
        CooptationDeleteDialogComponent,
        CooptationDeletePopupComponent
    ],
    entryComponents: [CooptationComponent, CooptationUpdateComponent, CooptationDeleteDialogComponent, CooptationDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CooptitCooptationModule {}
