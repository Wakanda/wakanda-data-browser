import { DataActionTypes, DataAction } from '../actions/data';

export interface State {
    query: string;
    tableName: string;
}

const initialState: State = {
    query: "",
    tableName: ""
};

export function reducer(
    state: State = initialState,
    action: DataAction
): State {
    console.log(state, action);
    switch (action.type) {
        case DataActionTypes.ResetQuery:
            return {
                ...state,
                query: "",
            };

        case DataActionTypes.SetQuery:
            return {
                ...state,
                query: action.payload,
            };

        case DataActionTypes.SwitchTable:
            return {
                ...state,
                tableName: action.payload,
            };

        default:
            return state;
    }
}

export const getQuery = (state: State) => state.query;