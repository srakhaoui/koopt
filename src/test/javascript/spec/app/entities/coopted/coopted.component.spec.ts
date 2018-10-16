/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CooptitTestModule } from '../../../test.module';
import { CooptedComponent } from 'app/entities/coopted/coopted.component';
import { CooptedService } from 'app/entities/coopted/coopted.service';
import { Coopted } from 'app/shared/model/coopted.model';

describe('Component Tests', () => {
    describe('Coopted Management Component', () => {
        let comp: CooptedComponent;
        let fixture: ComponentFixture<CooptedComponent>;
        let service: CooptedService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CooptedComponent],
                providers: []
            })
                .overrideTemplate(CooptedComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CooptedComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CooptedService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Coopted(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.coopteds[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
