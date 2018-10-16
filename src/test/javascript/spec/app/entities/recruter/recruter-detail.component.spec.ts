/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CooptitTestModule } from '../../../test.module';
import { RecruterDetailComponent } from 'app/entities/recruter/recruter-detail.component';
import { Recruter } from 'app/shared/model/recruter.model';

describe('Component Tests', () => {
    describe('Recruter Management Detail Component', () => {
        let comp: RecruterDetailComponent;
        let fixture: ComponentFixture<RecruterDetailComponent>;
        const route = ({ data: of({ recruter: new Recruter(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [RecruterDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(RecruterDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(RecruterDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.recruter).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
