import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as data from '../../actions/data';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit {


  query$: Observable<string>;
  data;
  columns$;
  columnNames$;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  length$: Observable<number>;
  pageSizeOptions = [20, 40, 80, 100];

  constructor(private store: Store<fromRoot.State>, private cd: ChangeDetectorRef) {
    this.query$ = this.store.pipe(select(fromRoot.getQuery));
    this.pageSize$ = this.store.pipe(select(fromRoot.getPageSize));
    this.length$ = this.store.pipe(select(fromRoot.getLength));
    this.columns$ = this.store.pipe(select(fromRoot.getColumns));
    this.columnNames$ = this.columns$.map(columns => {
      return columns.map(c => {
        return c.name;
      });
    });
    this.pageIndex$ = this.store.pipe(select(fromRoot.getStart))
    .withLatestFrom(this.pageSize$)
    .map(([start, pageSize]) => {
      return start / pageSize;
    });

    this.store.pipe(select(fromRoot.getRows)).subscribe(rows => {
      this.data = new MatTableDataSource<Object>(rows);
      this.cd.markForCheck();
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
