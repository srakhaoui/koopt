/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CooptitTestModule } from '../../../test.module';
import { CooptedDeleteDialogComponent } from 'app/entities/coopted/coopted-delete-dialog.component';
import { CooptedService } from 'app/entities/coopted/coopted.service';

describe('Component Tests', () => {
    describe('Coopted Management Delete Component', () => {
        let comp: CooptedDeleteDialogComponent;
        let fixture: ComponentFixture<CooptedDeleteDialogComponent>;
        let service: CooptedService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CooptitTestModule],
                declarations: [CooptedDeleteDialogComponent]
            })
                .overrideTemplate(CooptedDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CooptedDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CooptedService);
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
