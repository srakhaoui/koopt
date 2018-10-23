import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ISkill } from 'app/shared/model/skill.model';
import { SkillService } from './skill.service';

@Component({
    selector: 'jhi-skill-update',
    templateUrl: './skill-update.component.html'
})
export class SkillUpdateComponent implements OnInit {
    skill: ISkill;
    isSaving: boolean;

    constructor(private skillService: SkillService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ skill }) => {
            this.skill = skill;
        });
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
}
