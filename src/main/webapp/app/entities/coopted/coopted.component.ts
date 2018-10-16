import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICoopted } from 'app/shared/model/coopted.model';
import { Principal } from 'app/core';
import { CooptedService } from './coopted.service';

@Component({
    selector: 'jhi-coopted',
    templateUrl: './coopted.component.html'
})
export class CooptedComponent implements OnInit, OnDestroy {
    coopteds: ICoopted[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private cooptedService: CooptedService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.cooptedService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<ICoopted[]>) => (this.coopteds = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.cooptedService.query().subscribe(
            (res: HttpResponse<ICoopted[]>) => {
                this.coopteds = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCoopteds();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICoopted) {
        return item.id;
    }

    registerChangeInCoopteds() {
        this.eventSubscriber = this.eventManager.subscribe('cooptedListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
