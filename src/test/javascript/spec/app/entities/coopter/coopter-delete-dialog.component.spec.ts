/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CooptitTestModule } from '../../../test.module';
import { CoopterDeleteDialogComponent } from 'app/entities/coopter/coopter-delete-dialog.component';
import { CoopterService } from 'app/entities/coopter/coopter.service';

describe('Component Tests', () => {
    describe('Coopter Management Delete Component', () => {
        let comp: CoopterDeleteDialogComponent;
        let fixture: ComponentFixture<CoopterDeleteDialogComponent>;
        let service: CoopterService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CoopterDeleteDialogComponent]
            })
                .overrideTemplate(CoopterDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CoopterDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CoopterService);
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
