import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import * as fromRoot from '../../../reducers';
import * as router from '../../actions/router';
import * as data from '../../actions/data';
import * as layout from '../../actions/layout';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  query$: Observable<string>;
  showSidenav$: Observable<boolean>;
  loggedIn$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.query$ = this.store.pipe(select(fromRoot.getQuery));
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.loggedIn$ = this.store.pipe(
      select(fromRoot.getUser),
      map(user => user !== null)
    );
  }

  ngOnInit() {
  }

  queryStringChange(event) {
    this.store.dispatch(new router.UpdateQuery(event.currentTarget.value));
  }

  resetQuery() {
    this.store.dispatch(new router.UpdateQuery(""));
  }

  refreshResult() {
    this.store.dispatch(new data.FetchData());
  }

  toggleSideNav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }

  logout() {
    this.store.dispatch(new data.Logout());
  }

}
