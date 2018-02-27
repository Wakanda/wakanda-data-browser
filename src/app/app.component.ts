import { Component, ViewChild, ElementRef } from '@angular/core';
import { WakandaClient } from 'wakanda-client/browser/no-promise';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('paginator') paginator;

  title = 'Wakanda Data Browser';
  client;
  catalog;
  dataclasses;
  currentDataclass;
  data;
  columns = [];

  pageSizeOptions = [20, 40, 80, 160];
  length = 0;
  start = 0;
  pageSize = 60;

  query = "";
  lastQuery = "";

  constructor() {
    this.client = new WakandaClient({ host: 'http://localhost:8081' });
    this.client.getCatalog().then(c => {
      this.catalog = c;
      this.dataclasses = Object.keys(c);
      this.currentDataclass = this.dataclasses[0];
      this.dataclasses.length && this.fetchData();
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

  handlePageEvent(event) {
    //event = {pageIndex: 0, pageSize: 40, length: 1000}
    this.start = event.pageSize * event.pageIndex;
    this.pageSize = event.pageSize;

    this.fetchData();
  }

  switchDataclass(dataclass) {
    this.currentDataclass=dataclass;
    this.fetchData();
  }
}
