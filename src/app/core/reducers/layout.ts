import { LayoutActionTypes, LayoutAction } from '../actions/layout';

export interface State {
    showSidenav: boolean;
    loginFailed: boolean;
    loading: boolean;
}

const initialState: State = {
    showSidenav: true,
    loginFailed: false,
    loading: false,
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

        case LayoutActionTypes.LoginSuccess:
            return {
                ...state,
                loginFailed: false
            };

        case LayoutActionTypes.LoginFailure:
            return {
                ...state,
                loginFailed: true,
            };

        case LayoutActionTypes.Loading:
            return {
                ...state,
                loading: action.loading,
            };

        default:
            return state;
    }
}

export const getShowSidenav = (state: State) => state.showSidenav;
export const getLoginFailed = (state: State) => state.loginFailed;
export const getLoading = (state: State) => state.loading;