import { DataActionTypes, DataAction } from '../actions/data';
import {
    ColumnKinds,
    ColumnTypes
} from '../models/data';

export interface State {
    query: string;
    tableName: string;
    pageSize: number;
    start: number;
    length: number;
    rows: Array<any>;
    columns: Array<{type: ColumnTypes, kind: ColumnKinds, name: string}>;
}

const initialState: State = {
    query: "",
    tableName: "",
    pageSize: 20,
    start: 0,
    length: 0,
    rows: [],
    columns: []
};

export function reducer(
    state: State = initialState,
    action: DataAction
): State {
    switch (action.type) {
        case DataActionTypes.ResetQuery:
            return {
                ...state,
                query: "",
                start: 0,
            };

        case DataActionTypes.SetQuery:
            return {
                ...state,
                query: action.payload,
                start: 0,
            };

        case DataActionTypes.SwitchTable:
            return {
                ...state,
                tableName: action.payload,
                query: "",
                start: 0,
            };

        case DataActionTypes.ChangeOptions:
            return {
                ...state,
                pageSize: action.payload.pageSize,
                start: action.payload.pageIndex * action.payload.pageSize,
            };    

        case DataActionTypes.UpdateData:
            return {
                ...state,
                rows: action.payload.entities,
                length: action.payload.length
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
export const getStart = (state: State) => state.start;