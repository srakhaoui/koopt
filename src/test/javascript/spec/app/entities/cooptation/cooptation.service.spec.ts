/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { CooptationService } from 'app/entities/cooptation/cooptation.service';
import { ICooptation, Cooptation } from 'app/shared/model/cooptation.model';

describe('Service Tests', () => {
    describe('Cooptation Service', () => {
        let injector: TestBed;
        let service: CooptationService;
        let httpMock: HttpTestingController;
        let elemDefault: ICooptation;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(CooptationService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Cooptation(0, 'AAAAAAA', currentDate, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA');
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        performedOn: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Cooptation', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        performedOn: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        performedOn: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Cooptation(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Cooptation', async () => {
                const returnedFromService = Object.assign(
                    {
                        profile: 'BBBBBB',
                        performedOn: currentDate.format(DATE_TIME_FORMAT),
                        phoneNumber: 'BBBBBB',
                        linkedIn: 'BBBBBB',
                        firstName: 'BBBBBB',
                        lastName: 'BBBBBB',
                        email: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        performedOn: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Cooptation', async () => {
                const returnedFromService = Object.assign(
                    {
                        profile: 'BBBBBB',
                        performedOn: currentDate.format(DATE_TIME_FORMAT),
                        phoneNumber: 'BBBBBB',
                        linkedIn: 'BBBBBB',
                        firstName: 'BBBBBB',
                        lastName: 'BBBBBB',
                        email: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        performedOn: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a Cooptation', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
