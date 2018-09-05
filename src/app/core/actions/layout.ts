import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
    OpenSidenav = '[Layout] Open Sidenav',
    CloseSidenav = '[Layout] Close Sidenav',
    ToggleSidenav = '[Layout] Toggle Sidenav',
    ShowLogin = '[Layout] Show Login',
    LoginSuccess = '[Layout] Login Success',
    LoginFailure = '[Layout] Login Failure',
    ShowAddRow = '[Layout] Show Add Row',
    HideAddRow = '[Layout] Hide Add Row',
    ServerError = '[Layout] Server Error',
}

export class OpenSidenav implements Action {
    readonly type = LayoutActionTypes.OpenSidenav;
}

export class CloseSidenav implements Action {
    readonly type = LayoutActionTypes.CloseSidenav;
}

export class ToggleSidenav implements Action {
    readonly type = LayoutActionTypes.ToggleSidenav;
}

export class ShowLogin implements Action {
    readonly type = LayoutActionTypes.ShowLogin;

    constructor(public disableClose: boolean = true) { }
}

export class LoginSuccess implements Action {
    readonly type = LayoutActionTypes.LoginSuccess;
}

export class LoginFailure implements Action {
    readonly type = LayoutActionTypes.LoginFailure;
}

export class ShowAddRow implements Action {
    readonly type = LayoutActionTypes.ShowAddRow;
}

export class HideAddRow implements Action {
    readonly type = LayoutActionTypes.HideAddRow;
}

interface ServerErr {
    title?: string,
    message: string,
    callToAction?: string,
    operation: { description: string },
    options?: { noActions?: boolean }
}
export class ServerError implements Action {
    readonly type = LayoutActionTypes.ServerError;

    title;
    message;
    operation;
    options;
    callToAction;

    constructor(
        { title = '', message = '', callToAction = '', operation = { description: '' }, options = {} }: ServerErr
    ) {
        this.title = title;
        this.message = message;
        this.callToAction = callToAction;
        this.operation = {
            ...this.operation,
            ...operation,
        };
        this.options = {
            ...this.options,
            ...options,
        };
    }
}

export type LayoutAction = OpenSidenav | CloseSidenav | ToggleSidenav
    | ShowLogin | LoginSuccess | LoginFailure
    | ShowAddRow | HideAddRow
    | ServerError;
