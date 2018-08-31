import {
    ActionReducerMap,
    createSelector,
    createFeatureSelector
} from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import * as fromLayout from '../core/reducers/layout';
import * as fromData from '../core/reducers/data';
import { RouterStateUrl } from '../shared/utils';

export interface State {
    layout: fromLayout.State;
    data: fromData.State;
    router: fromRouter.RouterReducerState<RouterStateUrl>;
}


export const reducers: ActionReducerMap<State> = {
    layout: fromLayout.reducer,
    data: fromData.reducer,
    router: fromRouter.routerReducer,
};

export const getLayoutState = createFeatureSelector<fromLayout.State>('layout');
export const getDataState = createFeatureSelector<fromData.State>('data');

export const getShowSidenav = createSelector(
    getLayoutState,
    fromLayout.getShowSidenav
);
export const getShowLogin = createSelector(
    getLayoutState,
    fromLayout.getShowLogin
);
export const getLoginFailed = createSelector(
    getLayoutState,
    fromLayout.getLoginFailed
);
export const getShowAddRow = createSelector(
    getLayoutState,
    fromLayout.getShowAddRow
);
export const getQuery = createSelector(
    getDataState,
    fromData.getQuery
);
export const getPageSize = createSelector(
    getDataState,
    fromData.getPageSize
);
export const getLength = createSelector(
    getDataState,
    fromData.getLength
);
export const getRows = createSelector(
    getDataState,
    fromData.getRows
);
export const getTableName = createSelector(
    getDataState,
    fromData.getTableName
);
export const getColumns = createSelector(
    getDataState,
    fromData.getColumns
);
export const getStart = createSelector(
    getDataState,
    fromData.getStart
);
export const getTables = createSelector(
    getDataState,
    fromData.getTables
);
export const getUser = createSelector(
    getDataState,
    fromData.getUser
);