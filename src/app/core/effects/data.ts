import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';

import { Wakanda } from '../../wakanda';
import { isAuthError } from '../../shared/utils'
import { State } from '../../reducers';
import {
    FetchData,
    FetchColumns,
    UpdateData,
    UpdateColumns,
    FetchTables,
    UpdateTables,
    DataActionTypes,
    RemoveRows
} from '../actions/data';
import * as layoutActions from '../actions/layout';

@Injectable()
export class DataEffects {

    authErrorHandler() {
        return catchError(error => {
            if (isAuthError(error)) {
                this.store$.dispatch(new layoutActions.ShowLogin());
            }
            
            throw error;
        });
    }

    @Effect()
    fetch$ = this.actions$.pipe(
        ofType<FetchData>(DataActionTypes.FetchData),
        switchMap(() => this.wakanda.getCatalog()),
        withLatestFrom(this.store$),
        switchMap(([ds, state]: [any, State]) => {
            let query = state.data.query;
            let tableName = state.data.tableName;
            let pageSize = state.data.pageSize;
            let start = state.data.start;

            if (!tableName) {
                debugger;
                return;
            }

            return ds[tableName].query({
                filter: query,
                pageSize: pageSize,
                start: start
            });
        }),
        map((response: any) => {
            return new UpdateData({
                entities: response.entities,
                length: response._count
            });
        }),
        this.authErrorHandler()
    );

    @Effect()
    fetchTables = this.actions$.pipe(
        ofType<FetchTables>(DataActionTypes.FetchTables),
        switchMap(action => {
            return new Promise((resolve, reject) => {
                this.wakanda.getCatalog()
                    .then(c => {
                        resolve([c, action.payload]);
                    });
            })
        }),
        map(catalog => {
            let tables = Object.keys(catalog);

            return new UpdateTables(tables);
        }),
        this.authErrorHandler()
    );

    @Effect()
    fetchColumns$ = this.actions$.pipe(
        ofType<FetchColumns>(DataActionTypes.FetchColumns),
        switchMap(() => {
            return from(this.wakanda.getCatalog());
        }),
        withLatestFrom(this.store$),
        map(([ds, state]: [any, State]) => {
            let tableName = state.data.tableName;

            let columns = ds[state.data.tableName].attributes;
            return new UpdateColumns(columns);
        }),
        this.authErrorHandler()
    );

    @Effect()
    removeRows$ = this.actions$.pipe(
        ofType<RemoveRows>(DataActionTypes.RemoveRows),
        map(action => {
            return Promise.all(action.rows.map(row => {
                return row.delete();
            }));
        }),
        map(result => {
            return new FetchData();
        })
    );

    constructor(
        private actions$: Actions,
        private wakanda: Wakanda,
        private store$: Store<State>
    ) { }
}
