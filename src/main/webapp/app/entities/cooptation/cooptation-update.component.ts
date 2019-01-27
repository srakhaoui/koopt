import { Component, OnInit, ChangeDetectionStrategy  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable, of, concat } from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { ICooptation } from 'app/shared/model/cooptation.model';
import { CooptationService } from './cooptation.service';
import {Coopted, ICoopted} from 'app/shared/model/coopted.model';
import { CooptedService } from 'app/entities/coopted';
import { ICoopter } from 'app/shared/model/coopter.model';
import { CoopterService } from 'app/entities/coopter';
import { ISkill } from 'app/shared/model/skill.model';
import { SkillService } from 'app/entities/skill';
import {User} from 'app/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'jhi-cooptation-update',
    templateUrl: './cooptation-update.component.html',
    styles: [`.form-control { width: 300px; display: inline; }`]
})
export class CooptationUpdateComponent implements OnInit {
    cooptation: ICooptation;
    isSaving: boolean;
    coopters: ICoopter[];

    skills$: Observable<ISkill[]>;
    skillsLoading = false;
    skillsInput$ = new Subject<string>();

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
        });
        if (this.cooptation.coopted && this.cooptation.coopted.id) {
            this.cooptedService.find(this.cooptation.coopted.id).subscribe(
                (subRes: HttpResponse<ICoopted>) => {
                    this.cooptation.coopted = subRes.body;
                },
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
            );
        }else{
            this.cooptation.coopted = new Coopted(null,'','',new User());
            this.cooptation.skills = [];
        }
        this.coopterService.query().subscribe(
            (res: HttpResponse<ICoopter[]>) => {
                this.coopters = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.loadSkills();
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
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

    private loadSkills() {
        this.skills$ = concat(
            of([]), // default items
            this.skillsInput$.pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => this.skillsLoading = true),
                switchMap(term =>
                    this.skillService.suggest({
                        prefix: term
                    }).pipe(
                        catchError(() => of([])),
                        map((resp: HttpResponse<ISkill[]>) => resp.body))
                ),
                tap(() => this.skillsLoading = false)
            )
        );
    }
}
