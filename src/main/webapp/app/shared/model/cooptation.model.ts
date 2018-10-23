import { Moment } from 'moment';
import { ICoopted } from 'app/shared/model//coopted.model';
import { ICoopter } from 'app/shared/model//coopter.model';
import { ISkill } from 'app/shared/model//skill.model';

export interface ICooptation {
    id?: number;
    profile?: string;
    performedOn?: Moment;
    coopted?: ICoopted;
    coopter?: ICoopter;
    skills?: ISkill[];
}

export class Cooptation implements ICooptation {
    constructor(
        public id?: number,
        public profile?: string,
        public performedOn?: Moment,
        public coopted?: ICoopted,
        public coopter?: ICoopter,
        public skills?: ISkill[]
    ) {}
}
