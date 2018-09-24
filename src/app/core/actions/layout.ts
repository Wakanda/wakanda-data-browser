import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
    OpenSidenav = '[Layout] Open Sidenav',
    CloseSidenav = '[Layout] Close Sidenav',
    ToggleSidenav = '[Layout] Toggle Sidenav',
    ShowLogin = '[Layout] Show Login',
    HideLogin = '[Layout] Hide Login',
    ShowImage = '[Layout] Show Image',
    LoginSuccess = '[Layout] Login Success',
    LoginFailure = '[Layout] Login Failure',
    ShowAddRow = '[Layout] Show Add Row',
    HideAddRow = '[Layout] Hide Add Row',
    ServerError = '[Layout] Server Error',
    ServerConnectionError = '[Layout] Server Connection Error',
    Loading = '[Layout] Loading',
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

export class HideLogin implements Action {
    readonly type = LayoutActionTypes.HideLogin;
}

export class ShowImage implements Action {
    readonly type = LayoutActionTypes.ShowImage;

    constructor(public url: string) { }
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

export class Loading implements Action {
    readonly type = LayoutActionTypes.Loading;

    constructor(public loading: boolean) { }
}

interface ServerErr {
    title?: string,
    message: string,
    callToAction?: string,
    operation: { description: string },
    options?: { noActions?: boolean, disableClose?: boolean }
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

export class ServerConnectionError implements Action {
    readonly type = LayoutActionTypes.ServerConnectionError;
}

export type LayoutAction = OpenSidenav | CloseSidenav | ToggleSidenav
    | ShowLogin | HideLogin | LoginSuccess | LoginFailure
    | ShowAddRow | HideAddRow
    | ShowImage
    | ServerError | ServerConnectionError
    | Loading;
