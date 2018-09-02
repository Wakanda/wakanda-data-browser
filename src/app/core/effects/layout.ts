import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { State } from '../../reducers';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import {
    LayoutActionTypes,
    ShowLogin,
    LoginSuccess,
} from '../actions/layout';

@Injectable()
export class LayoutEffects {

    loginDialogRef: MatDialogRef<LoginDialogComponent>;

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

    constructor(
        private actions$: Actions,
        private store: Store<State>,
        private dialog: MatDialog,
    ) {
    }
}