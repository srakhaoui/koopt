import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICoopted } from 'app/shared/model/coopted.model';

@Component({
    selector: 'jhi-coopted-detail',
    templateUrl: './coopted-detail.component.html'
})
export class CooptedDetailComponent implements OnInit {
    coopted: ICoopted;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ coopted }) => {
            this.coopted = coopted;
        });
    }

    previousState() {
        window.history.back();
    }
}
