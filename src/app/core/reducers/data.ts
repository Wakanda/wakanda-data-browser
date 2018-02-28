import { DataActionTypes, DataAction } from '../actions/data';

export interface State {
    query: string;
    tableName: string;
    pageSize: number;
    start: number;
    length: number;
    rows: Array<any>;
    columns: Array<string>;
}

const initialState: State = {
    query: "",
    tableName: "",
    pageSize: 40,
    start: 0,
    length: 0,
    rows: [],
    columns: []
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

        case DataActionTypes.ChangeOptions:
            return {
                ...state,
                pageSize: action.payload.pageSize
            };    

        case DataActionTypes.UpdateData:
            return {
                ...state,
                rows: action.payload
            };      

        case DataActionTypes.UpdateColumns:
            return {
                ...state,
                columns: action.payload
            };        

        default:
            return state;
    }
}

export const getQuery = (state: State) => state.query;
export const getPageSize = (state: State) => state.pageSize;
export const getLength = (state: State) => state.length;
export const getRows = (state: State) => state.rows;
export const getTableName = (state: State) => state.tableName;
export const getColumns = (state: State) => state.columns;