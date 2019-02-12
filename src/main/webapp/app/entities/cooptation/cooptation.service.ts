import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICooptation } from 'app/shared/model/cooptation.model';

type EntityResponseType = HttpResponse<ICooptation>;
type EntityArrayResponseType = HttpResponse<ICooptation[]>;

@Injectable({ providedIn: 'root' })
export class CooptationService {
    public resourceUrl = SERVER_API_URL + 'api/cooptations';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/cooptations';

    constructor(private http: HttpClient) {}

    create(cooptation: ICooptation): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(cooptation);
        return this.http
            .post<ICooptation>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(cooptation: ICooptation): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(cooptation);
        return this.http
            .put<ICooptation>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ICooptation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICooptation[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICooptation[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertDateFromClient(cooptation: ICooptation): ICooptation {
        const copy: ICooptation = Object.assign({}, cooptation, {
            performedOn: cooptation.performedOn != null && cooptation.performedOn.isValid() ? cooptation.performedOn.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.performedOn = res.body.performedOn != null ? moment(res.body.performedOn) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((cooptation: ICooptation) => {
            cooptation.performedOn = cooptation.performedOn != null ? moment(cooptation.performedOn) : null;
        });
        return res;
    }
}
