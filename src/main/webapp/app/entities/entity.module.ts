import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CooptitCooptationModule } from './cooptation/cooptation.module';
import { CooptitSkillModule } from './skill/skill.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        CooptitCooptationModule,
        CooptitSkillModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CooptitEntityModule {}
