import { IUser } from 'app/core/user/user.model';

export interface IRecruter {
    id?: number;
    phoneNumber?: string;
    user?: IUser;
}

export class Recruter implements IRecruter {
    constructor(public id?: number, public phoneNumber?: string, public user?: IUser) {}
}
