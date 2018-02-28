import { Component, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('paginator') paginator;

  showSidenav$: Observable<boolean>;

  title = 'Wakanda Data Browser';
  catalog;
  tables;
  currentDataclass;
  data;
  columns = [];

  pageSizeOptions = [20, 40, 80, 160];
  length = 0;
  start = 0;
  pageSize = 60;

  query = "";
  lastQuery = "";

  constructor(private store: Store<fromRoot.State>, private wakanda: Wakanda) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.wakanda.getCatalog().then(c => {
      this.catalog = c;
      this.tables = Object.keys(c);
      this.currentDataclass = this.tables[0];
      this.tables.length && this.fetchData();
    });
  }

  fetchData() {
    let dataclass = this.catalog[this.currentDataclass];

    if (this.lastQuery !== this.query) {
      this.start = 0;
      this.paginator.firstPage();
    }

    dataclass.query({
      filter: this.query,
      pageSize: this.pageSize,
      start: this.start
    })
      .then(response => {
        this.columns = dataclass.attributes.map(attr => attr.name);
        this.data = new MatTableDataSource<Object>(response.entities);
        this.pageSize = response._pageSize;
        this.length = response._count;
      });
  }

  switchTable(tableName) {
    this.store.dispatch(new data.SwitchTable(tableName));
  }

  toggleSideNav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }
}
