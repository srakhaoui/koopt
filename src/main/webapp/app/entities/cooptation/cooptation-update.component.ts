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
import { ISkill } from 'app/shared/model/skill.model';
import { SkillService } from 'app/entities/skill';
import { User, IUser } from 'app/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'jhi-cooptation-update',
    templateUrl: './cooptation-update.component.html',
    styles: [`.form-control { width: 300px; display: inline; }`]
})
export class CooptationUpdateComponent implements OnInit {
    cooptation: ICooptation;
    isSaving: boolean;

    skills$: Observable<ISkill[]>;
    skillsLoading = false;
    skillsInput$ = new Subject<string>();

    constructor(
        private jhiAlertService: JhiAlertService,
        private cooptationService: CooptationService,
        private skillService: SkillService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cooptation }) => {
            this.cooptation = cooptation;
        });
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
