import { Moment } from 'moment';
import { ICoopter } from 'app/shared/model//coopter.model';
import { ICoopted } from 'app/shared/model//coopted.model';

export interface ICooptation {
    id?: number;
    profile?: string;
    skills?: string;
    performedOn?: Moment;
    coopter?: ICoopter;
    coopted?: ICoopted;
}

export class Cooptation implements ICooptation {
    constructor(
        public id?: number,
        public profile?: string,
        public skills?: string,
        public performedOn?: Moment,
        public coopter?: ICoopter,
        public coopted?: ICoopted
    ) {}
}
