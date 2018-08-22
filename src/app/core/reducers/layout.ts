import { LayoutActionTypes, LayoutAction } from '../actions/layout';

export interface State {
    showSidenav: boolean;
    showLogin: boolean;
}

const initialState: State = {
    showSidenav: true,
    showLogin: false
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

        case LayoutActionTypes.HideLogin:
            return {
                ...state,
                showLogin: false,
            };

        default:
            return state;
    }
}

export const getShowSidenav = (state: State) => state.showSidenav;
export const getShowLogin = (state: State) => state.showLogin;