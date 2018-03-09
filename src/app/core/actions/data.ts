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
    FetchData = '[Data] Fetch Data',
    UpdateData = '[Data] Update Data',
    FetchColumns = '[Data] Fetch Columns',
    UpdateColumns = '[Data] Update Columns',
    UpdateTables = '[Data] Update Tables',
    FetchTables = '[Data] Fetch Tables',
}

export class FetchData implements Action {
    readonly type = DataActionTypes.FetchData;
}

export class ChangeOptions implements Action {
    readonly type = DataActionTypes.ChangeOptions;

    constructor(public payload: { pageIndex?: number, pageSize?: number, length?: number, tableName?: string, query?: string }) { }
}

export class UpdateData implements Action {
    readonly type = DataActionTypes.UpdateData;

    constructor(public payload: { entities: Array<any>, length: number }) { }
}

export class FetchColumns implements Action {
    readonly type = DataActionTypes.FetchColumns;
}

export class UpdateColumns implements Action {
    readonly type = DataActionTypes.UpdateColumns;

    constructor(public payload: Array<{ type: ColumnTypes, kind: ColumnKinds, name: string }>) { }
}

export class FetchTables implements Action {
    readonly type = DataActionTypes.FetchTables;

    constructor(public payload?: string) { }
}

export class UpdateTables implements Action {
    readonly type = DataActionTypes.UpdateTables;

    constructor(public payload: Array<string>) { }
}

export type DataAction = FetchData | ChangeOptions | UpdateData | FetchColumns | UpdateColumns | UpdateTables | FetchTables;