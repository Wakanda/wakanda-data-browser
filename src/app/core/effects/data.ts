import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of, Observable } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap, filter } from 'rxjs/operators';

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
    RemoveRows,
    Login,
} from '../actions/data';
import * as layoutActions from '../actions/layout';

const NOPE_OBSERVABLE = new Observable();

@Injectable()
export class DataEffects {

    getCatalogOrLogin() {
        return from(this.wakanda.getCatalog())
            .pipe(catchError(error => {
                if (isAuthError(error)) {
                    this.store$.dispatch(new layoutActions.ShowLogin());
                }

                return NOPE_OBSERVABLE;
            }));
    }

    @Effect()
    fetch$ = this.actions$.pipe(
        ofType<FetchData>(DataActionTypes.FetchData),
        switchMap(() => this.getCatalogOrLogin()),
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
    );

    @Effect()
    fetchTables = this.actions$.pipe(
        ofType<FetchTables>(DataActionTypes.FetchTables),
        switchMap(() => this.getCatalogOrLogin()),
        map(catalog => {
            let tables = Object.keys(catalog);

            return new UpdateTables(tables);
        })
    );

    @Effect()
    fetchColumns$ = this.actions$.pipe(
        ofType<FetchColumns>(DataActionTypes.FetchColumns),
        switchMap(() => this.getCatalogOrLogin()),
        withLatestFrom(this.store$),
        map(([ds, state]: [any, State]) => {
            let tableName = state.data.tableName;

            let columns = ds[state.data.tableName].attributes;
            return new UpdateColumns(columns);
        })
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

    @Effect()
    login$ = this.actions$.pipe(
        ofType<Login>(DataActionTypes.Login),
        switchMap(action => {
            return from(
                this.wakanda.directory.login(
                    action.userName, action.password
                )
            ).pipe(
                catchError(err => {
                    return from([false]);
                })
            );
        }),
        switchMap((result) => {
            if (result) {
                return [
                    new layoutActions.LoginSuccess(),
                    new FetchColumns(),
                    new FetchTables(),
                    new FetchData()
                ];
            } else {
                this.store$.dispatch(new layoutActions.LoginFailure());
                return [];
            }
        })
    );

    constructor(
        private actions$: Actions,
        private wakanda: Wakanda,
        private store$: Store<State>
    ) { }
}
