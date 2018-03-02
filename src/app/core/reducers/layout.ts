import { LayoutActionTypes, LayoutAction } from '../actions/layout';

export interface State {
    showSidenav: boolean;
}

const initialState: State = {
    showSidenav: true,
};

export function reducer(
    state: State = initialState,
    action: LayoutAction
): State {
    switch (action.type) {
        case LayoutActionTypes.CloseSidenav:
            return {
                showSidenav: false,
            };

        case LayoutActionTypes.OpenSidenav:
            return {
                showSidenav: true,
            };

        case LayoutActionTypes.ToggleSidenav:
            return {
                showSidenav: !state.showSidenav,
            };

        default:
            return state;
    }
}

export const getShowSidenav = (state: State) => state.showSidenav;