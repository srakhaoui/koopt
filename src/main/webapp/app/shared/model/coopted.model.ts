import { IUser } from 'app/core/user/user.model';

export interface ICoopted {
    id?: number;
    phoneNumber?: string;
    linkedIn?: string;
    user?: IUser;
}

export class Coopted implements ICoopted {
    constructor(public id?: number, public phoneNumber?: string, public linkedIn?: string, public user?: IUser) {}
}
