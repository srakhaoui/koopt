import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICoopted } from 'app/shared/model/coopted.model';

type EntityResponseType = HttpResponse<ICoopted>;
type EntityArrayResponseType = HttpResponse<ICoopted[]>;

@Injectable({ providedIn: 'root' })
export class CooptedService {
    public resourceUrl = SERVER_API_URL + 'api/coopteds';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/coopteds';

    constructor(private http: HttpClient) {}

    create(coopted: ICoopted): Observable<EntityResponseType> {
        return this.http.post<ICoopted>(this.resourceUrl, coopted, { observe: 'response' });
    }

    update(coopted: ICoopted): Observable<EntityResponseType> {
        return this.http.put<ICoopted>(this.resourceUrl, coopted, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICoopted>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICoopted[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICoopted[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
