import { DataActionTypes, DataAction } from '../actions/data';
import {
    ColumnKinds,
    ColumnTypes
} from '../models/data';

export interface Column {
    type: ColumnTypes,
    kind: ColumnKinds,
    name: string,
}

export interface State {
    query: string;
    tableName: string;
    pageSize: number;
    start: number;
    length: number;
    rows: Array<any>;
    columns: Array<Column>;
    tables: Array<string>;
    user: { [key: string]: any };
    rowSaveInprogress: boolean;
    sortBy: string;
    sortDirection: string;
}

const initialState: State = {
    query: "",
    tableName: "",
    pageSize: 20,
    start: 0,
    length: 0,
    rows: [],
    columns: [],
    tables: [],
    user: null,
    rowSaveInprogress: false,
    sortBy: "",
    sortDirection: "",
};

export function reducer(
    state: State = initialState,
    action: DataAction
): State {
    switch (action.type) {

        case DataActionTypes.ChangeOptions:
            let payload = action.payload;

            let pageSize = payload.pageSize !== undefined ? payload.pageSize : state.pageSize;
            let start = payload.pageIndex !== undefined ? payload.pageIndex * pageSize : state.start;
            let query = payload.query !== undefined ? payload.query : state.query;
            let tableName = payload.tableName !== undefined ? payload.tableName : state.tableName;
            let sortBy = payload.sortBy !== undefined ? payload.sortBy : state.sortBy;
            let sortDirection = payload.sortDirection !== undefined ? payload.sortDirection : state.sortDirection;

            return {
                ...state,
                pageSize,
                start,
                query,
                tableName,
                sortBy,
                sortDirection
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

        case DataActionTypes.UpdateTables:
            return {
                ...state,
                tables: action.payload
            };

        case DataActionTypes.UpdateUser:
            return {
                ...state,
                user: action.payload
            };

        case DataActionTypes.AddRow:
            return {
                ...state,
                rowSaveInprogress: true,
            }

        case DataActionTypes.AddRowSuccess:
        case DataActionTypes.AddRowFailure:
            return {
                ...state,
                rowSaveInprogress: false,
            }

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
export const getTables = (state: State) => state.tables;
export const getUser = (state: State) => state.user;
export const getRowSaveInProgress = (state: State) => state.rowSaveInprogress;
export const getSortBy = (state: State) => state.sortBy;
export const getSortDirection = (state: State) => state.sortDirection;