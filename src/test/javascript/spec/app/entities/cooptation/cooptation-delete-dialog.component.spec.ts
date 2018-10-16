/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CooptitTestModule } from '../../../test.module';
import { CooptationDeleteDialogComponent } from 'app/entities/cooptation/cooptation-delete-dialog.component';
import { CooptationService } from 'app/entities/cooptation/cooptation.service';

describe('Component Tests', () => {
    describe('Cooptation Management Delete Component', () => {
        let comp: CooptationDeleteDialogComponent;
        let fixture: ComponentFixture<CooptationDeleteDialogComponent>;
        let service: CooptationService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CooptationDeleteDialogComponent]
            })
                .overrideTemplate(CooptationDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CooptationDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CooptationService);
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
