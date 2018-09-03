import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { State } from '../../reducers';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import {
    LayoutActionTypes,
    ShowAddRow,
    ShowLogin,
    LoginSuccess,
    HideAddRow,
} from '../actions/layout';
import { EntityDialogComponent } from '../components/entity-dialog/entity-dialog.component';

@Injectable()
export class LayoutEffects {

    loginDialogRef: MatDialogRef<LoginDialogComponent>;
    addRowDialogRef: MatDialogRef<EntityDialogComponent>;

    @Effect({ dispatch: false })
    showLogin$ = this.actions$.pipe(
        ofType<ShowLogin>(LayoutActionTypes.ShowLogin),
        tap(() => {
            this.loginDialogRef = this.dialog.open(LoginDialogComponent, {
                data: {},
                disableClose: true
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

    constructor(
        private actions$: Actions,
        private store: Store<State>,
        private dialog: MatDialog,
    ) {
    }
}