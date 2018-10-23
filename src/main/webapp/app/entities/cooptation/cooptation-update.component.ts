import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { ICooptation } from 'app/shared/model/cooptation.model';
import { CooptationService } from './cooptation.service';
import { ICoopted } from 'app/shared/model/coopted.model';
import { CooptedService } from 'app/entities/coopted';
import { ICoopter } from 'app/shared/model/coopter.model';
import { CoopterService } from 'app/entities/coopter';
import { ISkill } from 'app/shared/model/skill.model';
import { SkillService } from 'app/entities/skill';

@Component({
    selector: 'jhi-cooptation-update',
    templateUrl: './cooptation-update.component.html'
})
export class CooptationUpdateComponent implements OnInit {
    cooptation: ICooptation;
    isSaving: boolean;

    coopteds: ICoopted[];

    coopters: ICoopter[];

    skills: ISkill[];
    performedOn: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private cooptationService: CooptationService,
        private cooptedService: CooptedService,
        private coopterService: CoopterService,
        private skillService: SkillService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cooptation }) => {
            this.cooptation = cooptation;
            this.performedOn = this.cooptation.performedOn != null ? this.cooptation.performedOn.format(DATE_TIME_FORMAT) : null;
        });
        this.cooptedService.query({ filter: 'cooptation-is-null' }).subscribe(
            (res: HttpResponse<ICoopted[]>) => {
                if (!this.cooptation.coopted || !this.cooptation.coopted.id) {
                    this.coopteds = res.body;
                } else {
                    this.cooptedService.find(this.cooptation.coopted.id).subscribe(
                        (subRes: HttpResponse<ICoopted>) => {
                            this.coopteds = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.coopterService.query().subscribe(
            (res: HttpResponse<ICoopter[]>) => {
                this.coopters = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.skillService.query().subscribe(
            (res: HttpResponse<ISkill[]>) => {
                this.skills = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.cooptation.performedOn = this.performedOn != null ? moment(this.performedOn, DATE_TIME_FORMAT) : null;
        if (this.cooptation.id !== undefined) {
            this.subscribeToSaveResponse(this.cooptationService.update(this.cooptation));
        } else {
            this.subscribeToSaveResponse(this.cooptationService.create(this.cooptation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICooptation>>) {
        result.subscribe((res: HttpResponse<ICooptation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCooptedById(index: number, item: ICoopted) {
        return item.id;
    }

    trackCoopterById(index: number, item: ICoopter) {
        return item.id;
    }

    trackSkillById(index: number, item: ISkill) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
