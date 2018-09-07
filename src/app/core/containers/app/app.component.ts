import { Component } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import * as fromRoot from '../../../reducers';
import * as layout from '../../actions/layout';
import * as router from '../../actions/router';

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
  loading$: Observable<boolean>;

  loginDialogRef: MatDialogRef<LoginDialogComponent>;

  constructor(private store: Store<fromRoot.State>, private dialog: MatDialog) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.tables$ = this.store.pipe(select(fromRoot.getTables));
    this.tableName$ = this.store.pipe(select(fromRoot.getTableName));
    this.loading$ = this.store.pipe(select(fromRoot.getLoading));
  }

  switchTable(tableName) {
    this.store.dispatch(new router.SwitchTable({ table: tableName }));
  }

  toggleSideNav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }
}
