import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IRecruter } from 'app/shared/model/recruter.model';
import { RecruterService } from './recruter.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-recruter-update',
    templateUrl: './recruter-update.component.html'
})
export class RecruterUpdateComponent implements OnInit {
    recruter: IRecruter;
    isSaving: boolean;

    users: IUser[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private recruterService: RecruterService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ recruter }) => {
            this.recruter = recruter;
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
        if (this.recruter.id !== undefined) {
            this.subscribeToSaveResponse(this.recruterService.update(this.recruter));
        } else {
            this.subscribeToSaveResponse(this.recruterService.create(this.recruter));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IRecruter>>) {
        result.subscribe((res: HttpResponse<IRecruter>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
