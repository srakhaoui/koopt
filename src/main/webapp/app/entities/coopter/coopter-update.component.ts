import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ICoopter } from 'app/shared/model/coopter.model';
import { CoopterService } from './coopter.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-coopter-update',
    templateUrl: './coopter-update.component.html'
})
export class CoopterUpdateComponent implements OnInit {
    coopter: ICoopter;
    isSaving: boolean;

    users: IUser[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private coopterService: CoopterService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ coopter }) => {
            this.coopter = coopter;
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
        if (this.coopter.id !== undefined) {
            this.subscribeToSaveResponse(this.coopterService.update(this.coopter));
        } else {
            this.subscribeToSaveResponse(this.coopterService.create(this.coopter));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICoopter>>) {
        result.subscribe((res: HttpResponse<ICoopter>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
