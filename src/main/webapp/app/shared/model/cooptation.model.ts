import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { ISkill } from 'app/shared/model//skill.model';

export interface ICooptation {
    id?: number;
    profile?: string;
    performedOn?: Moment;
    phoneNumber?: string;
    linkedIn?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    coopter?: IUser;
    skills?: ISkill[];
}

export class Cooptation implements ICooptation {
    constructor(
        public id?: number,
        public profile?: string,
        public performedOn?: Moment,
        public phoneNumber?: string,
        public linkedIn?: string,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public coopter?: IUser,
        public skills?: ISkill[]
    ) {}
}
