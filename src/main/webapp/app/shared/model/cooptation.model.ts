import { Moment } from 'moment';
import { ISkill } from 'app/shared/model//skill.model';
import { ICoopter } from 'app/shared/model//coopter.model';
import { ICoopted } from 'app/shared/model//coopted.model';

export interface ICooptation {
    id?: number;
    profile?: string;
    performedOn?: Moment;
    skills?: ISkill[];
    coopter?: ICoopter;
    coopted?: ICoopted;
}

export class Cooptation implements ICooptation {
    constructor(
        public id?: number,
        public profile?: string,
        public performedOn?: Moment,
        public skills?: ISkill[],
        public coopter?: ICoopter,
        public coopted?: ICoopted
    ) {}
}
