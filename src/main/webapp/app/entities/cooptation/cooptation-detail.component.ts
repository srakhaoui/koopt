import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICooptation } from 'app/shared/model/cooptation.model';

@Component({
    selector: 'jhi-cooptation-detail',
    templateUrl: './cooptation-detail.component.html'
})
export class CooptationDetailComponent implements OnInit {
    cooptation: ICooptation;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cooptation }) => {
            this.cooptation = cooptation;
        });
    }

    previousState() {
        window.history.back();
    }
}
