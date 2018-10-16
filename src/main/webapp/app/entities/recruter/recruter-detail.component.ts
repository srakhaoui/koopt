import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRecruter } from 'app/shared/model/recruter.model';

@Component({
    selector: 'jhi-recruter-detail',
    templateUrl: './recruter-detail.component.html'
})
export class RecruterDetailComponent implements OnInit {
    recruter: IRecruter;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ recruter }) => {
            this.recruter = recruter;
        });
    }

    previousState() {
        window.history.back();
    }
}
