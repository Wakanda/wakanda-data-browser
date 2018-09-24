import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of, Observable } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';

import { Wakanda } from '../../wakanda';
import { isAuthError } from '../../shared/utils'
import { State } from '../../reducers';
import {
    DataActionTypes,
    Fetch,
    FetchData,
    FetchColumns,
    FetchUser,
    UpdateData,
    UpdateColumns,
    UpdateUser,
    FetchTables,
    UpdateTables,
    Login,
    LoginSuccess,
    LoginFailure,
    Logout,
    AddRow,
    AddRowSuccess,
    AddRowFailure,
    ConfirmRemoveRows,
} from '../actions/data';
import * as layoutActions from '../actions/layout';
import * as routerActions from '../actions/router';
import { flattenServerErrors } from '../../shared/utils';

const NOPE_OBSERVABLE = new Observable();

@Injectable()
export class DataEffects {

    getCatalogOrLogin() {
        this.store$.dispatch(new layoutActions.Loading(true));

        return from(this.wakanda.getCatalog())
            .pipe(catchError(error => {
                this.store$.dispatch(new layoutActions.Loading(false));
                if (isAuthError(error)) {
                    this.store$.dispatch(new layoutActions.ShowLogin());
                } else {
                    this.store$.dispatch(new layoutActions.ServerConnectionError());
                }

                return NOPE_OBSERVABLE;
            }));
    }

    @Effect()
    fetchData$ = this.actions$.pipe(
        ofType<FetchData>(DataActionTypes.FetchData),
        switchMap(() => this.getCatalogOrLogin()), // loading = true
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

            return from(ds[tableName].query({
                filter: query,
                pageSize: pageSize,
                start: start
            })).pipe(catchError(err => {
                return of({ error: true, data: err });
            }));
        }),
        map((response: any) => {
            this.store$.dispatch(new layoutActions.Loading(false));

            if (response.error) {
                let parsedResponse = JSON.parse(response.data.response);
                return new layoutActions.ServerError({
                    message: flattenServerErrors(parsedResponse),
                    operation: { description: 'querying the database' },
                    title: 'Query error',
                    callToAction: 'Check that the query is correct.'
                });
            } else {
                return new UpdateData({
                    entities: response.entities,
                    length: response._count
                });
            }
        }),
    );

    @Effect()
    fetchTables = this.actions$.pipe(
        ofType<FetchTables>(DataActionTypes.FetchTables),
        switchMap(() => this.getCatalogOrLogin()), // loading = true
        switchMap(catalog => {
            let tables = Object.keys(catalog);

            return [
                new UpdateTables(tables),
                new FetchColumns(), // loading = false
            ];
        })
    );

    @Effect()
    fetchColumns$ = this.actions$.pipe(
        ofType<FetchColumns>(DataActionTypes.FetchColumns),
        switchMap(() => this.getCatalogOrLogin()), // loading = true
        withLatestFrom(this.store$),
        switchMap(([ds, state]: [any, State]) => {
            let tableName = state.data.tableName;

            if (!tableName) {
                debugger;
            }

            let columns = ds[tableName].attributes;
            return [
                new UpdateColumns(columns),
                new FetchData(), // loading = false
            ];
        })
    );

    @Effect()
    confirmRemoveRows$ = this.actions$.pipe(
        ofType<ConfirmRemoveRows>(DataActionTypes.ConfirmRemoveRows),
        switchMap(action => {
            this.store$.dispatch(new layoutActions.Loading(true));

            return from(
                Promise.all(action.rows.map(row => {
                    return row.delete();
                }))
            ).pipe(catchError(err => {
                return of({ error: true, data: err });
            }));
        }),
        map((response: any) => {
            if (response.error) {
                this.store$.dispatch(new layoutActions.Loading(false));

                let parsedResponse = JSON.parse(response.data.response);
                return new layoutActions.ServerError({
                    message: flattenServerErrors(parsedResponse),
                    operation: { description: 'removing entities' },
                    title: 'Remove entities error'
                });
            } else {
                return new FetchData();  // loading = false
            }
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
    fetch$ = this.actions$.pipe(
        ofType<Fetch>(DataActionTypes.Fetch),
        switchMap(() => {
            return [
                new layoutActions.Loading(true),
                new FetchUser(),
                new FetchTables, // loading = false
            ];
        })
    );

    @Effect()
    loginSuccess$ = this.actions$.pipe(
        ofType<LoginSuccess>(DataActionTypes.LoginSuccess),
        switchMap(() => {
            return [
                new layoutActions.LoginSuccess(),
                new routerActions.Initialize(),
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

    @Effect({ dispatch: false })
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
        tap(() => {
            window.location.reload();
        })
    );

    @Effect()
    addRow$ = this.actions$.pipe(
        ofType<AddRow>(DataActionTypes.AddRow),
        withLatestFrom(this.store$, this.wakanda.getCatalog()), // loading = true
        switchMap(([action, store, ds]) => {
            let tableName = store.data.tableName;
            let entity = ds[tableName].create(action.values);

            return from(entity.save())
                .pipe(
                    switchMap(_entity => {
                        /**
                         * Since we can't upload images/blobs
                         * before the entity is saved we do it afterwards.
                         */
                        let arr = Object.keys(action.values)
                            .filter(key => {
                                return action.values[key] instanceof File;
                            })
                            .map(key => {
                                return switchMap(ent => {
                                    return from(ent[key].upload(action.values[key]));
                                });
                            });

                        /**
                         * (1st upload)-[switchMap]->(2nd upload)->...
                         * If we don't do this we'll have two options:
                         * - use the same entity object => STAMP error
                         * - fetch the entity after every upload and do
                         *   unnecessary requests.
                         */
                        //@ts-ignore
                        return of(_entity).pipe(...arr);
                    }),
                    catchError(err => {
                        return of({ error: true, data: err });
                    })
                );
        }),
        map((response: any) => {
            if (response.error) {
                this.store$.dispatch(new layoutActions.Loading(false));

                let parsedResponse = JSON.parse(response.data.response);

                this.store$.dispatch(new layoutActions.ServerError({
                    message: flattenServerErrors(parsedResponse),
                    operation: { description: 'creating entity' },
                    title: 'Create entity error'
                }));

                return new AddRowFailure();
            } else {
                return new AddRowSuccess(); // loading = false
            }
        })
    );

    @Effect()
    addRowSuccess$ = this.actions$.pipe(
        ofType<AddRowSuccess>(DataActionTypes.AddRowSuccess),
        switchMap(() => [
            new FetchData(), // loading = false
            new layoutActions.HideAddRow(),
        ])
    );

    constructor(
        private actions$: Actions,
        private wakanda: Wakanda,
        private store$: Store<State>
    ) { }
}
