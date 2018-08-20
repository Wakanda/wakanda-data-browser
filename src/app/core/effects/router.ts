import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';

import { State } from '../../reducers';
import {
    Go,
    SwitchTable,
    UpdatePageOptions,
    UpdateQuery,
    RouterActionTypes,
    RouterAction
} from '../actions/router';

import * as dataActions from '../actions/data';
import { Wakanda } from '../../wakanda';


@Injectable()
export class RouterEffects {
    @Effect({ dispatch: false })
    navigate$ = this.actions$.pipe(
        ofType<Go>(RouterActionTypes.Go),
        map((action: Go) => action.payload),
        map(({ path, query: queryParams, extras }) => this.router.navigate(path, { queryParams, ...extras }))
    );

    @Effect()
    switchTable$ = this.actions$.pipe(
        ofType<SwitchTable>(RouterActionTypes.SwitchTable),
        map((action) => action.params),
        withLatestFrom(this.store$),
        map(([params, state]: [any, State]) => {
            let query = params.query || "";
            let table = params.table || "";
            let currentParams = state.router.state.queryParams;
            return new Go({
                path: [''],
                query: {
                    ...currentParams,
                    table,
                    query,
                    page: 0
                }
            });
        })
    );

    @Effect()
    updateQuery$ = this.actions$.pipe(
        ofType<UpdateQuery>(RouterActionTypes.UpdateQuery),
        map((action) => action.query),
        withLatestFrom(this.store$),
        map(([query, state]: [string, State]) => {
            let currentParams = state.router.state.queryParams;
            return new Go({
                path: [''],
                query: {
                    ...currentParams,
                    query
                }
            });
        })
    );

    @Effect()
    updatePageOptions$ = this.actions$.pipe(
        ofType<UpdatePageOptions>(RouterActionTypes.UpdatePageOptions),
        map((action) => action.options),
        withLatestFrom(this.store$),
        map(([options, state]: [any, State]) => {
            let currentParams = state.router.state.queryParams;
            let page = options.pageIndex;
            let pageSize = options.pageSize;

            return new Go({
                path: [''],
                query: {
                    ...currentParams,
                    page,
                    pageSize
                }
            });
        })
    );

    @Effect({ dispatch: false })
    routeChange = this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        map((action: any) => {
            let { queryParams } = action.payload.routerState;

            return queryParams;
        }),
        withLatestFrom(this.store$),
        map(([params, state]) => {
            if (!params.table) {
                this.wakanda.getCatalog()
                    .then(c => {
                        let tables = Object.keys(c);
                        this.store$.dispatch(new SwitchTable({ table: tables[0] })); // <- navigate to first table here
                    });
            } else if (!params.page || !params.pageSize) {
                this.store$.dispatch(new UpdatePageOptions({
                    pageSize: state.data.pageSize,
                    pageIndex: state.data.start / state.data.pageSize,
                }));
            } else {
                let pageSize = parseInt(params.pageSize);
                let pageIndex = parseInt(params.page);
                let query = params.query || "";
                let tableName = params.table;
                let length = state.data.length;

                this.store$.dispatch(new dataActions.ChangeOptions({
                    pageIndex,
                    pageSize,
                    length,
                    tableName,
                    query
                }));
                this.store$.dispatch(new dataActions.FetchColumns());
                this.store$.dispatch(new dataActions.FetchTables());
                this.store$.dispatch(new dataActions.FetchData());
            }

        })
    );

    constructor(
        private actions$: Actions,
        private store$: Store<State>,
        private router: Router,
        private wakanda: Wakanda,
    ) { }
}
