import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as data from '../../actions/data';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  query$: Observable<string>;
  data;
  columns$;
  pageSize$: Observable<number>;
  length$: Observable<number>;
  pageSizeOptions = [20, 40, 80, 100];

  constructor(private store: Store<fromRoot.State>) {
    this.query$ = this.store.pipe(select(fromRoot.getQuery));
    this.pageSize$ = this.store.pipe(select(fromRoot.getPageSize));
    this.length$ = this.store.pipe(select(fromRoot.getLength));
    this.columns$ = this.store.pipe(select(fromRoot.getColumns));

    this.store.pipe(select(fromRoot.getTableName)).distinctUntilChanged().subscribe(() => {
      this.store.dispatch(new data.FetchColumns());
    });

    this.store.pipe(select(fromRoot.getRows)).subscribe(rows => {
      this.data = new MatTableDataSource<Object>(rows);
    });

    this.query$.distinctUntilChanged().subscribe(() => {
      this.store.dispatch(new data.FetchData());
    });

    this.pageSize$.distinctUntilChanged().subscribe(() => {
      this.store.dispatch(new data.FetchData());
    });

    this.length$.distinctUntilChanged().subscribe(() => {
      this.store.dispatch(new data.FetchData());
    });
  }

  ngOnInit() {
  }

  handlePageEvent(event) {
    this.store.dispatch(new data.ChangeOptions(event));
  }

  queryStringChange(event) {
    this.store.dispatch(new data.SetQuery(event.currentTarget.value));
  }

  resetQuery() {
    this.store.dispatch(new data.ResetQuery());
  }

  refreshResult() {
    this.store.dispatch(new data.FetchData());
  }

}
