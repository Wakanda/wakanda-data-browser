import { Action } from '@ngrx/store';
import Entity from 'wakanda-client/dist/presentation/entity'
import {
    ColumnKinds,
    ColumnTypes
} from '../models/data';

export enum DataActionTypes {
    SwitchTable = '[Data] Switch Dataclass',
    ResetQuery = '[Data] Reset Query',
    SetQuery = '[Data] Set Query',
    ChangeOptions = '[Data] Change Options',
    Fetch = '[Data] Fetch',
    FetchData = '[Data] Fetch Data',
    UpdateData = '[Data] Update Data',
    UpdateUser = '[Data] Update User',
    FetchUser = '[Data] Fetch User',
    FetchColumns = '[Data] Fetch Columns',
    UpdateColumns = '[Data] Update Columns',
    UpdateTables = '[Data] Update Tables',
    FetchTables = '[Data] Fetch Tables',
    RemoveRows = '[Data] Remove Rows',
    ConfirmRemoveRows = '[Data] Confirm Remove Rows',
    Login = '[Data] Login',
    LoginSuccess = '[Data] Login Success',
    LoginFailure = '[Data] Login Failure',
    Logout = '[Data] Logout',
    AddRow = '[Data] Add Row',
    AddRowSuccess = '[Data] Add Row Success',
    AddRowFailure = '[Data] Add Row Failure',
}

export class FetchData implements Action {
    readonly type = DataActionTypes.FetchData;
}

interface FetchOptions {
    pageIndex?: number;
    pageSize?: number;
    length?: number;
    tableName?: string;
    query?: string;
    sortBy?: string;
    sortDirection?: string;
}

export class ChangeOptions implements Action {
    readonly type = DataActionTypes.ChangeOptions;

    constructor(public payload: FetchOptions) { }
}

export class UpdateData implements Action {
    readonly type = DataActionTypes.UpdateData;

    constructor(public payload: { entities: Array<any>, length: number }) { }
}

export class UpdateUser implements Action {
    readonly type = DataActionTypes.UpdateUser;

    constructor(public payload: { [key: string]: any; }) { }
}

export class Fetch implements Action {
    readonly type = DataActionTypes.Fetch;
}

export class FetchUser implements Action {
    readonly type = DataActionTypes.FetchUser;
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
}

export class UpdateTables implements Action {
    readonly type = DataActionTypes.UpdateTables;

    constructor(public payload: Array<string>) { }
}

export class RemoveRows implements Action {
    readonly type = DataActionTypes.RemoveRows;

    constructor(public rows: Array<Entity>) { }
}

export class ConfirmRemoveRows implements Action {
    readonly type = DataActionTypes.ConfirmRemoveRows;

    constructor(public rows: Array<Entity>) { }
}

export class Login implements Action {
    readonly type = DataActionTypes.Login;

    constructor(public userName: string, public password: string) { }
}

export class LoginSuccess implements Action {
    readonly type = DataActionTypes.LoginSuccess;
}

export class LoginFailure implements Action {
    readonly type = DataActionTypes.LoginFailure;
}

export class Logout implements Action {
    readonly type = DataActionTypes.Logout;
}

export class AddRow implements Action {
    readonly type = DataActionTypes.AddRow;

    constructor(public values: any) { }
}

export class AddRowSuccess implements Action {
    readonly type = DataActionTypes.AddRowSuccess;
}

export class AddRowFailure implements Action {
    readonly type = DataActionTypes.AddRowFailure;
}

export type DataAction = Fetch | FetchData | FetchTables | FetchColumns | FetchUser
    | UpdateData | UpdateColumns | UpdateTables | UpdateUser
    | ChangeOptions
    | RemoveRows | ConfirmRemoveRows | AddRow | AddRowSuccess | AddRowFailure
    | Login | LoginSuccess | LoginFailure | Logout;