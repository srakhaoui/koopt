/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CooptitTestModule } from '../../../test.module';
import { RecruterDeleteDialogComponent } from 'app/entities/recruter/recruter-delete-dialog.component';
import { RecruterService } from 'app/entities/recruter/recruter.service';

describe('Component Tests', () => {
    describe('Recruter Management Delete Component', () => {
        let comp: RecruterDeleteDialogComponent;
        let fixture: ComponentFixture<RecruterDeleteDialogComponent>;
        let service: RecruterService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [RecruterDeleteDialogComponent]
            })
                .overrideTemplate(RecruterDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(RecruterDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RecruterService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
