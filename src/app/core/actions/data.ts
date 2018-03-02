import { Action } from '@ngrx/store';
import {
    ColumnKinds,
    ColumnTypes
} from '../models/data';

export enum DataActionTypes {
    SwitchTable = '[Data] Switch Dataclass',
    ResetQuery = '[Data] Reset Query',
    SetQuery = '[Data] Set Query',
    ChangeOptions = '[Data] Change Options',
    FetchData = '[Data] Fetch',
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

    constructor(public payload: { pageIndex: number, pageSize: number, length: number }) { }
}

export class UpdateData implements Action {
    readonly type = DataActionTypes.UpdateData;

    constructor(public payload: {entities: Array<any>, length: number}) { }
}

export class FetchColumns implements Action {
    readonly type = DataActionTypes.FetchColumns;
}

export class UpdateColumns implements Action {
    readonly type = DataActionTypes.UpdateColumns;

    constructor(public payload: Array<{type: ColumnTypes, kind: ColumnKinds, name: string}>) { }
}

export type DataAction = SwitchTable | ResetQuery | SetQuery | FetchData | ChangeOptions | UpdateData | FetchColumns | UpdateColumns;