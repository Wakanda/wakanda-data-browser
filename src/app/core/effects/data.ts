import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { State } from '../../reducers';
import { Wakanda } from '../../wakanda';
import {
    SwitchTable,
    ResetQuery,
    SetQuery,
    FetchData,
    ChangeOptions,
    UpdateData,
    UpdateColumns,
    DataActionTypes
} from '../actions/data';


@Injectable()
export class DataEffects {
    @Effect({ dispatch: false })
    fetch$ = this.actions$
        .ofType<FetchData>(DataActionTypes.FetchData)
        .withLatestFrom(this.store$)
        .map((args) => {
            let state: State = args[1];
            let query = state.data.query;
            let tableName = state.data.tableName;
            let pageSize = state.data.pageSize;
            let start = state.data.start;

            if(!tableName) {
                return;
            }

            this.wakanda.getCatalog()
                .then(ds => {
                    ds[state.data.tableName].query({
                        filter: query,
                        pageSize: pageSize,
                        start:start
                    })
                        .then(response => {
                            this.store$.dispatch(new UpdateData(response.entities));
                            this.store$.dispatch(new ChangeOptions({pageSize: response._pageSize, start, length: response._count}));
                        });
                });
        });

    @Effect({ dispatch: false })
    fetchColumns$ = this.actions$
        .ofType<FetchData>(DataActionTypes.FetchColumns)
        .withLatestFrom(this.store$)
        .map((args) => {
            let state: State = args[1];
            let query = state.data.query;
            let tableName = state.data.tableName;
            let pageSize = state.data.pageSize;
            let start = state.data.start;

            if(!tableName) {
                return;
            }

            this.wakanda.getCatalog()
                .then(ds => {
                    let columns = ds[state.data.tableName].attributes.map(attr => attr.name);
                    this.store$.dispatch(new UpdateColumns(columns));
                });
        });

    constructor(
        private actions$: Actions,
        private wakanda: Wakanda,
        private store$: Store<State>
    ) { }
}
