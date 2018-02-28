import { Action } from '@ngrx/store';

export enum DataActionTypes {
    SwitchTable = '[Data] Switch Dataclass',
    ResetQuery = '[Data] Reset Query',
    SetQuery = '[Data] Set Query',
    FetchData = '[Data] Fetch',
    ChangeOptions = '[Data] Change Options',
    UpdateData = '[Data] Update Data',
    FetchColumns = '[Data] Fetch Columns',
    UpdateColumns = '[Data] Update Columns',
}

export class SwitchTable implements Action {
    readonly type = DataActionTypes.SwitchTable;

    constructor(public payload: string) { }
}

export class ResetQuery implements Action {
    readonly type = DataActionTypes.ResetQuery;
}

export class SetQuery implements Action {
    readonly type = DataActionTypes.SetQuery;

    constructor(public payload: string) { }
}

export class FetchData implements Action {
    readonly type = DataActionTypes.FetchData;
}

export class ChangeOptions implements Action {
    readonly type = DataActionTypes.ChangeOptions;

    constructor(public payload: { start: number, pageSize: number, length: number }) { }
}

export class UpdateData implements Action {
    readonly type = DataActionTypes.UpdateData;

    constructor(public payload: Array<any>) { }
}

export class FetchColumns implements Action {
    readonly type = DataActionTypes.FetchColumns;
}

export class UpdateColumns implements Action {
    readonly type = DataActionTypes.UpdateColumns;

    constructor(public payload: Array<string>) { }
}

export type DataAction = SwitchTable | ResetQuery | SetQuery | FetchData | ChangeOptions | UpdateData | FetchColumns | UpdateColumns;