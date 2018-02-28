import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as data from '../../actions/data';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  query$: Observable<string>;
  data = [];
  columns = [];
  pageSize = 0;
  length = 0;
  pageSizeOptions = [20, 40, 80, 100];

  constructor(private store: Store<fromRoot.State>) {
    this.query$ = this.store.pipe(select(fromRoot.getQuery));
  }

  ngOnInit() {
  }

  handlePageEvent(event) {

  }

  queryStringChange(event) {
    this.store.dispatch(new data.SetQuery(event.currentTarget.value));
  }

  resetQuery() {
    this.store.dispatch(new data.ResetQuery());
  }

}
