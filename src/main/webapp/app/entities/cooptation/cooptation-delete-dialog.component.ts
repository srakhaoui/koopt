import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICooptation } from 'app/shared/model/cooptation.model';
import { CooptationService } from './cooptation.service';

@Component({
    selector: 'jhi-cooptation-delete-dialog',
    templateUrl: './cooptation-delete-dialog.component.html'
})
export class CooptationDeleteDialogComponent {
    cooptation: ICooptation;

    constructor(private cooptationService: CooptationService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.cooptationService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'cooptationListModification',
                content: 'Deleted an cooptation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-cooptation-delete-popup',
    template: ''
})
export class CooptationDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cooptation }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CooptationDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.cooptation = cooptation;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
