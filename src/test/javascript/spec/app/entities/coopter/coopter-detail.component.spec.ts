/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CooptitTestModule } from '../../../test.module';
import { CoopterDetailComponent } from 'app/entities/coopter/coopter-detail.component';
import { Coopter } from 'app/shared/model/coopter.model';

describe('Component Tests', () => {
    describe('Coopter Management Detail Component', () => {
        let comp: CoopterDetailComponent;
        let fixture: ComponentFixture<CoopterDetailComponent>;
        const route = ({ data: of({ coopter: new Coopter(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CoopterDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CoopterDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CoopterDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.coopter).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
