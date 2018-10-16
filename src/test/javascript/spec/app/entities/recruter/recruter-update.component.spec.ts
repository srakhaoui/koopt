/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CooptitTestModule } from '../../../test.module';
import { RecruterUpdateComponent } from 'app/entities/recruter/recruter-update.component';
import { RecruterService } from 'app/entities/recruter/recruter.service';
import { Recruter } from 'app/shared/model/recruter.model';

describe('Component Tests', () => {
    describe('Recruter Management Update Component', () => {
        let comp: RecruterUpdateComponent;
        let fixture: ComponentFixture<RecruterUpdateComponent>;
        let service: RecruterService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [RecruterUpdateComponent]
            })
                .overrideTemplate(RecruterUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(RecruterUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RecruterService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Recruter(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.recruter = entity;
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
                    const entity = new Recruter();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.recruter = entity;
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
