import { Moment } from 'moment';
import { ICoopted } from 'app/shared/model//coopted.model';
import { ICoopter } from 'app/shared/model//coopter.model';
import { ISkill } from 'app/shared/model//skill.model';

export interface ICooptation {
    id?: number;
    profile?: string;
<<<<<<< stable
    performedOn?: Moment;
    coopted?: ICoopted;
    coopter?: ICoopter;
=======
    firstName?: string;
    lastName?: string;
    linkedIn?: string;
    email?: string;
    phoneNumber?: string;
>>>>>>> 4925161 Remove performedOn field from the front Cooptation  entity
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
