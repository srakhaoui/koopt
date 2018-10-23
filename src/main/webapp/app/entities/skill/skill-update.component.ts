import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ISkill } from 'app/shared/model/skill.model';
import { SkillService } from './skill.service';
import { ICooptation } from 'app/shared/model/cooptation.model';
import { CooptationService } from 'app/entities/cooptation';

@Component({
    selector: 'jhi-skill-update',
    templateUrl: './skill-update.component.html'
})
export class SkillUpdateComponent implements OnInit {
    skill: ISkill;
    isSaving: boolean;

    cooptations: ICooptation[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private skillService: SkillService,
        private cooptationService: CooptationService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ skill }) => {
            this.skill = skill;
        });
        this.cooptationService.query().subscribe(
            (res: HttpResponse<ICooptation[]>) => {
                this.cooptations = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.skill.id !== undefined) {
            this.subscribeToSaveResponse(this.skillService.update(this.skill));
        } else {
            this.subscribeToSaveResponse(this.skillService.create(this.skill));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ISkill>>) {
        result.subscribe((res: HttpResponse<ISkill>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCooptationById(index: number, item: ICooptation) {
        return item.id;
    }
}
