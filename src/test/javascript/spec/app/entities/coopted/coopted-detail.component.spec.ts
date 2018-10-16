/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CooptitTestModule } from '../../../test.module';
import { CooptedDetailComponent } from 'app/entities/coopted/coopted-detail.component';
import { Coopted } from 'app/shared/model/coopted.model';

describe('Component Tests', () => {
    describe('Coopted Management Detail Component', () => {
        let comp: CooptedDetailComponent;
        let fixture: ComponentFixture<CooptedDetailComponent>;
        const route = ({ data: of({ coopted: new Coopted(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CooptedDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CooptedDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CooptedDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.coopted).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
