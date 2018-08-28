import { Component } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import * as fromRoot from '../../../reducers';
import * as layoutActions from '../../actions/layout';
import * as routerActions from '../../actions/router';

import { LoginDialogComponent } from '../../components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showSidenav$: Observable<boolean>;
  tables$: Observable<Array<string>>;
  tableName$: Observable<string>;
  showLogin$: Observable<boolean>;

  userName: string;
  password: string;
  loginDialogRef: MatDialogRef<LoginDialogComponent>;

  constructor(private store: Store<fromRoot.State>, private dialog: MatDialog) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.tables$ = this.store.pipe(select(fromRoot.getTables));
    this.tableName$ = this.store.pipe(select(fromRoot.getTableName));
    this.showLogin$ = this.store.pipe(select(fromRoot.getShowLogin));

    this.showLogin$.subscribe(showLogin => {
      if (showLogin) {
        this.loginDialogRef = this.dialog.open(LoginDialogComponent, {
          // width: '250px',
          data: { userName: this.userName, password: this.password }
        });
      } else {
        this.loginDialogRef && this.loginDialogRef.close();
      }
    });
  }

  switchTable(tableName) {
    this.store.dispatch(new routerActions.SwitchTable({ table: tableName }));
  }

  toggleSideNav() {
    this.store.dispatch(new layoutActions.ToggleSidenav());
  }

  login() {
    
  }
}
