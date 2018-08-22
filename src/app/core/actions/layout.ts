import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
    OpenSidenav = '[Layout] Open Sidenav',
    CloseSidenav = '[Layout] Close Sidenav',
    ToggleSidenav = '[Layout] Toggle Sidenav',
    ShowLogin = '[Layout] Show Login',
    HideLogin = '[Layout] Hide Login',
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

export class HideLogin implements Action {
    readonly type = LayoutActionTypes.HideLogin;
}

export type LayoutAction = OpenSidenav | CloseSidenav | ToggleSidenav |
    ShowLogin | HideLogin;
