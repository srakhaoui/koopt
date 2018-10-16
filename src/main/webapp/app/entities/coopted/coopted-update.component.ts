import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ICoopted } from 'app/shared/model/coopted.model';
import { CooptedService } from './coopted.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-coopted-update',
    templateUrl: './coopted-update.component.html'
})
export class CooptedUpdateComponent implements OnInit {
    coopted: ICoopted;
    isSaving: boolean;

    users: IUser[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private cooptedService: CooptedService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ coopted }) => {
            this.coopted = coopted;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.coopted.id !== undefined) {
            this.subscribeToSaveResponse(this.cooptedService.update(this.coopted));
        } else {
            this.subscribeToSaveResponse(this.cooptedService.create(this.coopted));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICoopted>>) {
        result.subscribe((res: HttpResponse<ICoopted>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
