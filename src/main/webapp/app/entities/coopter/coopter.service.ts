import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICoopter } from 'app/shared/model/coopter.model';

type EntityResponseType = HttpResponse<ICoopter>;
type EntityArrayResponseType = HttpResponse<ICoopter[]>;

@Injectable({ providedIn: 'root' })
export class CoopterService {
    public resourceUrl = SERVER_API_URL + 'api/coopters';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/coopters';

    constructor(private http: HttpClient) {}

    create(coopter: ICoopter): Observable<EntityResponseType> {
        return this.http.post<ICoopter>(this.resourceUrl, coopter, { observe: 'response' });
    }

    update(coopter: ICoopter): Observable<EntityResponseType> {
        return this.http.put<ICoopter>(this.resourceUrl, coopter, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICoopter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICoopter[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICoopter[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
