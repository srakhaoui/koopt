/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CooptitTestModule } from '../../../test.module';
import { SkillComponent } from 'app/entities/skill/skill.component';
import { SkillService } from 'app/entities/skill/skill.service';
import { Skill } from 'app/shared/model/skill.model';

describe('Component Tests', () => {
    describe('Skill Management Component', () => {
        let comp: SkillComponent;
        let fixture: ComponentFixture<SkillComponent>;
        let service: SkillService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [SkillComponent],
                providers: []
            })
                .overrideTemplate(SkillComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SkillComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SkillService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Skill(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.skills[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
