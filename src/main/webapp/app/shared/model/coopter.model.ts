import { IUser } from 'app/core/user/user.model';

export interface ICoopter {
    id?: number;
    phoneNumber?: string;
    user?: IUser;
}

export class Coopter implements ICoopter {
    constructor(public id?: number, public phoneNumber?: string, public user?: IUser) {}
}
