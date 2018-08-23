import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
    OpenSidenav = '[Layout] Open Sidenav',
    CloseSidenav = '[Layout] Close Sidenav',
    ToggleSidenav = '[Layout] Toggle Sidenav',
    ShowLogin = '[Layout] Show Login',
    LoginSuccess = '[Layout] Login Success',
    LoginFailure = '[Layout] Login Failure',
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
}

export class LoginSuccess implements Action {
    readonly type = LayoutActionTypes.LoginSuccess;
}

export class LoginFailure implements Action {
    readonly type = LayoutActionTypes.LoginFailure;
}

export type LayoutAction = OpenSidenav | CloseSidenav | ToggleSidenav |
    ShowLogin | LoginSuccess | LoginFailure;
