import { Action } from '@ngrx/store';

export enum DataActionTypes {
    SwitchTable = '[Data] Switch Dataclass',
    ResetQuery = '[Data] Reset Query',
    SetQuery = '[Data] Set Query',
}

export class SwitchTable implements Action {
    readonly type = DataActionTypes.SwitchTable;
    
    constructor(public payload: string) {}
}

export class ResetQuery implements Action {
    readonly type = DataActionTypes.ResetQuery;
}

export class SetQuery implements Action {
    readonly type = DataActionTypes.SetQuery;
    
    constructor(public payload: string) {}
}

export type DataAction = SwitchTable | ResetQuery | SetQuery;