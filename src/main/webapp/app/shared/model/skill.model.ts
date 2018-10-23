import { ICooptation } from 'app/shared/model//cooptation.model';

export interface ISkill {
    id?: number;
    code?: string;
    label?: string;
    cooptation?: ICooptation;
}

export class Skill implements ISkill {
    constructor(public id?: number, public code?: string, public label?: string, public cooptation?: ICooptation) {}
}
