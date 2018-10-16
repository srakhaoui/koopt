/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CooptitTestModule } from '../../../test.module';
import { CooptationUpdateComponent } from 'app/entities/cooptation/cooptation-update.component';
import { CooptationService } from 'app/entities/cooptation/cooptation.service';
import { Cooptation } from 'app/shared/model/cooptation.model';

describe('Component Tests', () => {
    describe('Cooptation Management Update Component', () => {
        let comp: CooptationUpdateComponent;
        let fixture: ComponentFixture<CooptationUpdateComponent>;
        let service: CooptationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CooptationUpdateComponent]
            })
                .overrideTemplate(CooptationUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CooptationUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CooptationService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Cooptation(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.cooptation = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Cooptation();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.cooptation = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
