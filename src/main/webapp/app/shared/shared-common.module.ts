import { NgModule } from '@angular/core';

import { CooptitSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [CooptitSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [CooptitSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class CooptitSharedCommonModule {}
