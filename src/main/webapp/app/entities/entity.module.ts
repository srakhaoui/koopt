import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CooptitCoopterModule } from './coopter/coopter.module';
import { CooptitCooptedModule } from './coopted/coopted.module';
import { CooptitCooptationModule } from './cooptation/cooptation.module';
import { CooptitRecruterModule } from './recruter/recruter.module';
import { CooptitSkillModule } from './skill/skill.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        CooptitCoopterModule,
        CooptitCooptedModule,
        CooptitCooptationModule,
        CooptitRecruterModule,
        CooptitSkillModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CooptitEntityModule {}
