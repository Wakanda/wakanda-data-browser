import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/fromPromise';

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
    fetch$ = this.actions$
        .ofType<FetchData>(
            DataActionTypes.FetchData
        )
        .switchMap(() => {
            return this.wakanda.getCatalog();
        })
        .withLatestFrom(this.store$)
        .switchMap(([ds, state]: [any, State]) => {
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
        })
        .map((response: any) => {
            return new UpdateData({
                entities: response.entities,
                length: response._count
            });
        });

    @Effect()
    fetchTables = this.actions$
        .ofType<FetchTables>(DataActionTypes.FetchTables)
        .mergeMap(action => {
            return new Promise((resolve, reject) => {
                this.wakanda.getCatalog()
                    .then(c => {
                        resolve([c, action.payload]);
                    });
            })
        })
        .map(([catalog, table]) => {
            let tables = Object.keys(catalog);

            return new UpdateTables(tables);
        });

    @Effect()
    fetchColumns$ = this.actions$
        .ofType<FetchColumns>(DataActionTypes.FetchColumns)
        .switchMap(() => {
            return Observable.fromPromise(this.wakanda.getCatalog());
        })
        .withLatestFrom(this.store$)
        .map(([ds, state]: [any, State]) => {
            let tableName = state.data.tableName;

            let columns = ds[state.data.tableName].attributes;
            return new UpdateColumns(columns);
        });

    constructor(
        private actions$: Actions,
        private wakanda: Wakanda,
        private store$: Store<State>
    ) { }
}
