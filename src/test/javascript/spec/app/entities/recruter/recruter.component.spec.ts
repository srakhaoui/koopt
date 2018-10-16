/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CooptitTestModule } from '../../../test.module';
import { RecruterComponent } from 'app/entities/recruter/recruter.component';
import { RecruterService } from 'app/entities/recruter/recruter.service';
import { Recruter } from 'app/shared/model/recruter.model';

describe('Component Tests', () => {
    describe('Recruter Management Component', () => {
        let comp: RecruterComponent;
        let fixture: ComponentFixture<RecruterComponent>;
        let service: RecruterService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [RecruterComponent],
                providers: []
            })
                .overrideTemplate(RecruterComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(RecruterComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RecruterService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Recruter(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.recruters[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
