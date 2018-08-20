import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { switchMap, mergeMap, withLatestFrom, map } from 'rxjs/operators';

import { State } from '../../reducers';
import { Wakanda } from '../../wakanda';
import {
    FetchData,
    FetchColumns,
    ChangeOptions,
    UpdateData,
    UpdateColumns,
    FetchTables,
    UpdateTables,
    DataActionTypes
} from '../actions/data';
import * as routerActions from '../actions/router';

@Injectable()
export class DataEffects {
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
        })
    );

    @Effect()
    fetchTables = this.actions$.pipe(
        ofType<FetchTables>(DataActionTypes.FetchTables),
        mergeMap(action => {
            return new Promise((resolve, reject) => {
                this.wakanda.getCatalog()
                    .then(c => {
                        resolve([c, action.payload]);
                    });
            })
        }),
        map(([catalog, table]) => {
            let tables = Object.keys(catalog);

            return new UpdateTables(tables);
        })
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
        })
    );

    constructor(
        private actions$: Actions,
        private wakanda: Wakanda,
        private store$: Store<State>
    ) { }
}
