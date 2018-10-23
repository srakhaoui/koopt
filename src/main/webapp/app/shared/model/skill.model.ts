export interface ISkill {
    id?: number;
    code?: string;
    label?: string;
}

export class Skill implements ISkill {
    constructor(public id?: number, public code?: string, public label?: string) {}
}
