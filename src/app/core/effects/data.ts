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
    SwitchTable,
    ResetQuery,
    SetQuery,
    FetchData,
    FetchColumns,
    ChangeOptions,
    UpdateData,
    UpdateColumns,
    DataActionTypes
} from '../actions/data';


@Injectable()
export class DataEffects {
    @Effect()
    fetch$ = this.actions$
        .ofType<FetchData | SetQuery | ResetQuery | SwitchTable | ChangeOptions>(
        DataActionTypes.FetchData,
        DataActionTypes.SetQuery,
        DataActionTypes.ResetQuery,
        DataActionTypes.SwitchTable,
        DataActionTypes.ChangeOptions,
    )
        .switchMap(() => {
            return Observable.fromPromise(this.wakanda.getCatalog());
        })
        .withLatestFrom(this.store$)
        .switchMap(([ds, state]: [any, State]) => {
            let query = state.data.query;
            let tableName = state.data.tableName;
            let pageSize = state.data.pageSize;
            let start = state.data.start;

            if (!tableName) {
                return;
            }

            return Observable.fromPromise(ds[state.data.tableName].query({
                filter: query,
                pageSize: pageSize,
                start: start
            }));
        })
        .map((response: any) => {
            return new UpdateData({
                entities: response.entities,
                length: response._count
            });
        });

    @Effect()
    SwitchTable = this.actions$
        .ofType<SwitchTable>(DataActionTypes.SwitchTable)
        .map(() => {
            return new FetchColumns();
        });

    @Effect()
    fetchColumns$ = this.actions$
        .ofType<FetchColumns>(DataActionTypes.FetchColumns)
        .switchMap(() => {
            return Observable.fromPromise(this.wakanda.getCatalog());
        })
        .withLatestFrom(this.store$)
        .map(([ds, state]: [any, State]) => {
            let query = state.data.query;
            let tableName = state.data.tableName;
            let pageSize = state.data.pageSize;
            let start = state.data.start;

            if (!tableName) {
                return;
            }

            let columns = ds[state.data.tableName].attributes;
            return new UpdateColumns(columns);
        });

    constructor(
        private actions$: Actions,
        private wakanda: Wakanda,
        private store$: Store<State>
    ) { }
}
