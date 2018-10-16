/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CooptitTestModule } from '../../../test.module';
import { CooptationDetailComponent } from 'app/entities/cooptation/cooptation-detail.component';
import { Cooptation } from 'app/shared/model/cooptation.model';

describe('Component Tests', () => {
    describe('Cooptation Management Detail Component', () => {
        let comp: CooptationDetailComponent;
        let fixture: ComponentFixture<CooptationDetailComponent>;
        const route = ({ data: of({ cooptation: new Cooptation(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CooptationDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CooptationDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CooptationDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.cooptation).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
