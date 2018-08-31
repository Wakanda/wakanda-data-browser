import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of, Observable } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';

import { Wakanda } from '../../wakanda';
import { isAuthError } from '../../shared/utils'
import { State } from '../../reducers';
import {
    FetchData,
    FetchColumns,
    FetchUser,
    UpdateData,
    UpdateColumns,
    UpdateUser,
    FetchTables,
    UpdateTables,
    DataActionTypes,
    RemoveRows,
    Login,
    LoginSuccess,
    LoginFailure,
    Logout,
    AddRow,
    AddRowSuccess,
    AddRowFailure,
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
            // TODO: handle failure
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
        map((result) => {
            if (result) {
                return new LoginSuccess();
            } else {
                return new LoginFailure();
            }
        })
    );

    @Effect()
    loginSuccess$ = this.actions$.pipe(
        ofType<LoginSuccess>(DataActionTypes.LoginSuccess),
        switchMap(() => {
            return [
                new FetchUser(),
                new FetchColumns(),
                new FetchTables(),
                new FetchData(),
                new layoutActions.LoginSuccess(),
            ];
        })
    );

    @Effect()
    loginFailure$ = this.actions$.pipe(
        ofType<LoginFailure>(DataActionTypes.LoginFailure),
        map(() => new layoutActions.LoginFailure())
    );

    @Effect()
    fetchUser$ = this.actions$.pipe(
        ofType<FetchUser>(DataActionTypes.FetchUser),
        switchMap(() => {
            return from(
                this.wakanda.directory.getCurrentUser()
            ).pipe(
                catchError(err => {
                    return from([null]);
                })
            );
        }),
        map(user => {
            return new UpdateUser(user);
        })
    );

    @Effect()
    logout$ = this.actions$.pipe(
        ofType<Logout>(DataActionTypes.Logout),
        switchMap(() => {
            return from(this.wakanda.directory.logout())
                .pipe(
                    catchError(() => {
                        return of(false);
                    })
                )
        }),
        tap(()=>{
            window.location.reload();
        })
    )

    @Effect()
    addRow$ = this.actions$.pipe(
        ofType<AddRow>(DataActionTypes.AddRow),
        withLatestFrom(this.store$, this.wakanda.getCatalog()),
        switchMap(([action, store, ds]) => {
            let tableName = store.data.tableName;
            let entity = ds[tableName].create(action.values);

            return from(entity.save())
                .pipe(
                    catchError(err => {
                        return from([false]);
                    })
                );
        }),
        map(result => {
            if (result !== false) {
                return new AddRowSuccess();
            } else {
                return new AddRowFailure(); // TODO
            }
        })
    );

    @Effect()
    addRowSuccess$ = this.actions$.pipe(
        ofType<AddRowSuccess>(DataActionTypes.AddRowSuccess),
        switchMap(() => [
            new FetchData(),
            new layoutActions.HideAddRow(),
        ])
    );

    constructor(
        private actions$: Actions,
        private wakanda: Wakanda,
        private store$: Store<State>
    ) { }
}
