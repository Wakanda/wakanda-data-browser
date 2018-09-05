import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import {
    LayoutActionTypes,
    ShowAddRow,
    ShowLogin,
    LoginSuccess,
    HideAddRow,
    ServerError,
} from '../actions/layout';
import { EntityDialogComponent } from '../components/entity-dialog/entity-dialog.component';
import { ServerErrorDialogComponent } from '../components/server-error-dialog/server-error-dialog.component';

@Injectable()
export class LayoutEffects {

    loginDialogRef: MatDialogRef<LoginDialogComponent>;
    addRowDialogRef: MatDialogRef<EntityDialogComponent>;

    @Effect({ dispatch: false })
    showLogin$ = this.actions$.pipe(
        ofType<ShowLogin>(LayoutActionTypes.ShowLogin),
        tap(action => {
            this.loginDialogRef = this.dialog.open(LoginDialogComponent, {
                data: {},
                disableClose: action.disableClose
            });
        })
    );

    @Effect({ dispatch: false })
    loginSuccess$ = this.actions$.pipe(
        ofType<LoginSuccess>(LayoutActionTypes.LoginSuccess),
        tap(() => {
            this.loginDialogRef.close();
        })
    );

    @Effect({ dispatch: false })
    addRow$ = this.actions$.pipe(
        ofType<ShowAddRow>(LayoutActionTypes.ShowAddRow),
        tap(() => {
            this.addRowDialogRef = this.dialog.open(EntityDialogComponent, {
                data: {},
                disableClose: true
            });
        })
    );

    @Effect({ dispatch: false })
    addRowSuccess$ = this.actions$.pipe(
        ofType<HideAddRow>(LayoutActionTypes.HideAddRow),
        tap(() => {
            this.addRowDialogRef.close();
        })
    );

    @Effect({ dispatch: false })
    serverError$ = this.actions$.pipe(
        ofType<ServerError>(LayoutActionTypes.ServerError),
        tap(action => {
            this.dialog.open(ServerErrorDialogComponent, {
                data: {
                    message: action.message,
                    operation: action.operation,
                    options: action.options,
                    title: action.title,
                    callToAction: action.callToAction
                },
                disableClose: true,
            });
        })
    );

    constructor(
        private actions$: Actions,
        private dialog: MatDialog,
    ) { }
}