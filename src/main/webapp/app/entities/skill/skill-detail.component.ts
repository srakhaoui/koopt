import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISkill } from 'app/shared/model/skill.model';

@Component({
    selector: 'jhi-skill-detail',
    templateUrl: './skill-detail.component.html'
})
export class SkillDetailComponent implements OnInit {
    skill: ISkill;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ skill }) => {
            this.skill = skill;
        });
    }

    previousState() {
        window.history.back();
    }
}
