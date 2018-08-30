import { LayoutActionTypes, LayoutAction } from '../actions/layout';

export interface State {
    showSidenav: boolean;
    showLogin: boolean;
    loginFailed: boolean;
    showAddRow: boolean;
}

const initialState: State = {
    showSidenav: true,
    showLogin: false,
    loginFailed: false,
    showAddRow: false,
};

export function reducer(
    state: State = initialState,
    action: LayoutAction
): State {
    switch (action.type) {
        case LayoutActionTypes.CloseSidenav:
            return {
                ...state,
                showSidenav: false,
            };

        case LayoutActionTypes.OpenSidenav:
            return {
                ...state,
                showSidenav: true,
            };

        case LayoutActionTypes.ToggleSidenav:
            return {
                ...state,
                showSidenav: !state.showSidenav,
            };

        case LayoutActionTypes.ShowLogin:
            return {
                ...state,
                showLogin: true,
            };

        case LayoutActionTypes.LoginSuccess:
            return {
                ...state,
                showLogin: false,
                loginFailed: false
            };

        case LayoutActionTypes.LoginFailure:
            return {
                ...state,
                loginFailed: true,
            };

        case LayoutActionTypes.ShowAddRow:
            return {
                ...state,
                showAddRow: true,
            };

        case LayoutActionTypes.HideAddRow:
            return {
                ...state,
                showAddRow: false,
            };

        default:
            return state;
    }
}

export const getShowSidenav = (state: State) => state.showSidenav;
export const getShowLogin = (state: State) => state.showLogin;
export const getLoginFailed = (state: State) => state.loginFailed;
export const getShowAddRow = (state: State) => state.showAddRow;