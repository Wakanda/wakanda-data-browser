import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { map, withLatestFrom, catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
    // ROUTER_REQUEST,
    ROUTER_NAVIGATION,
    // ROUTER_NAVIGATED,
    // ROUTER_CANCEL,
    // ROUTER_ERROR,
} from '@ngrx/router-store';

import { State } from '../../reducers';
import {
    Go,
    SwitchTable,
    UpdatePageOptions,
    UpdateQuery,
    RouterActionTypes,
    Initialize,
} from '../actions/router';

import * as dataActions from '../actions/data';
import * as layoutActions from '../actions/layout';
import { Wakanda } from '../../wakanda';

@Injectable()
export class RouterEffects {

    // @Effect()
    // request$ = this.actions$.pipe(
    //     ofType(ROUTER_REQUEST),
    //     map(() => {
    //         return new layoutActions.Loading(true);
    //     })
    // );

    // @Effect()
    // navigated$ = this.actions$.pipe(
    //     ofType(ROUTER_NAVIGATED, ROUTER_CANCEL, ROUTER_ERROR),
    //     map(() => {
    //         return new layoutActions.Loading(false);
    //     })
    // );

    @Effect({ dispatch: false })
    navigate$ = this.actions$.pipe(
        ofType<Go>(RouterActionTypes.Go),
        map((action: Go) => action.payload),
        tap(({ path, query: queryParams, extras }) => {
            this.router.navigate(path, { queryParams, ...extras })
        })
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

    @Effect()
    initialize$ = this.actions$.pipe(
        ofType<Initialize>(RouterActionTypes.Initialize),
        switchMap(action => {
            return from(this.wakanda.getCatalog())
                .pipe(catchError(() => {
                    return of({ error: true });
                }));
        }),
        withLatestFrom(this.store$),
        map(([catalog, store]) => {
            if (catalog.error) {
                return new layoutActions.ShowLogin();
            } else if (store.router.state.queryParams.table) {
                return new dataActions.Fetch();
            } else {
                return new SwitchTable({ table: Object.keys(catalog)[0] });
            }
        })
    );

    @Effect()
    routeChange$ = this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        map((action: any) => {
            let { queryParams } = action.payload.routerState;

            return queryParams;
        }),
        withLatestFrom(this.store$),
        map(([params, state]) => {
            if (!params.table) {
                return new Initialize();
            } else if (!params.page || !params.pageSize) {
                return new UpdatePageOptions({
                    pageSize: state.data.pageSize,
                    pageIndex: state.data.start / state.data.pageSize,
                });
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

                return new dataActions.Fetch();
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
