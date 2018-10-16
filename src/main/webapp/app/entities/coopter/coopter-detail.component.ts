import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICoopter } from 'app/shared/model/coopter.model';

@Component({
    selector: 'jhi-coopter-detail',
    templateUrl: './coopter-detail.component.html'
})
export class CoopterDetailComponent implements OnInit {
    coopter: ICoopter;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ coopter }) => {
            this.coopter = coopter;
        });
    }

    previousState() {
        window.history.back();
    }
}
