/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CooptitTestModule } from '../../../test.module';
import { CoopterUpdateComponent } from 'app/entities/coopter/coopter-update.component';
import { CoopterService } from 'app/entities/coopter/coopter.service';
import { Coopter } from 'app/shared/model/coopter.model';

describe('Component Tests', () => {
    describe('Coopter Management Update Component', () => {
        let comp: CoopterUpdateComponent;
        let fixture: ComponentFixture<CoopterUpdateComponent>;
        let service: CoopterService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CoopterUpdateComponent]
            })
                .overrideTemplate(CoopterUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CoopterUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CoopterService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Coopter(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.coopter = entity;
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
                    const entity = new Coopter();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.coopter = entity;
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
