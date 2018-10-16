/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CooptitTestModule } from '../../../test.module';
import { CooptedUpdateComponent } from 'app/entities/coopted/coopted-update.component';
import { CooptedService } from 'app/entities/coopted/coopted.service';
import { Coopted } from 'app/shared/model/coopted.model';

describe('Component Tests', () => {
    describe('Coopted Management Update Component', () => {
        let comp: CooptedUpdateComponent;
        let fixture: ComponentFixture<CooptedUpdateComponent>;
        let service: CooptedService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CooptedUpdateComponent]
            })
                .overrideTemplate(CooptedUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CooptedUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CooptedService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Coopted(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.coopted = entity;
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
                    const entity = new Coopted();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.coopted = entity;
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
