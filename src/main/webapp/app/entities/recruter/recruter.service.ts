import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IRecruter } from 'app/shared/model/recruter.model';

type EntityResponseType = HttpResponse<IRecruter>;
type EntityArrayResponseType = HttpResponse<IRecruter[]>;

@Injectable({ providedIn: 'root' })
export class RecruterService {
    public resourceUrl = SERVER_API_URL + 'api/recruters';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/recruters';

    constructor(private http: HttpClient) {}

    create(recruter: IRecruter): Observable<EntityResponseType> {
        return this.http.post<IRecruter>(this.resourceUrl, recruter, { observe: 'response' });
    }

    update(recruter: IRecruter): Observable<EntityResponseType> {
        return this.http.put<IRecruter>(this.resourceUrl, recruter, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IRecruter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IRecruter[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IRecruter[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
