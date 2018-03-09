import { Component } from '@angular/core';
import { WakandaClient } from 'wakanda-client/browser/no-promise';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as layout from '../../actions/layout';
import * as data from '../../actions/data';
import { Wakanda } from '../../../wakanda';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showSidenav$: Observable<boolean>;

  title = 'Wakanda Data Browser';
  catalog;
  data;
  columns = [];
  tableName$: Observable<string>;

  length$ = 0;
  pageSize$: Observable<number>;
  currentTable$: Observable<string>;

  constructor(private store: Store<fromRoot.State>, private wakanda: Wakanda) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.tableName$ = this.store.pipe(select(fromRoot.getTableName));
  }

  switchTable(tableName) {
    this.store.dispatch(new data.SwitchTable(tableName));
  }

  toggleSideNav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }
}
