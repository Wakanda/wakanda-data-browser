import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { withLatestFrom, map, skip } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as data from '../../actions/data';
import * as layout from '../../actions/layout';
import * as router from '../../actions/router';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';

import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// import { query } from '@angular/animations';

import Entity from 'wakanda-client/dist/presentation/entity';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit {

  addRowDialogRef: MatDialogRef<EntityDialogComponent>;
  
  data$: Observable<MatTableDataSource<Entity>>;
  dataSource: MatTableDataSource<Entity>;
  columns$;
  columnNames$;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  length$: Observable<number>;

  pageSizeOptions = [20, 40, 80, 100];
  selection: SelectionModel<Entity> = new SelectionModel<Entity>(true, []);

  constructor(private store: Store<fromRoot.State>, private cd: ChangeDetectorRef, private dialog: MatDialog) {
    
    this.pageSize$ = this.store.pipe(select(fromRoot.getPageSize));
    this.length$ = this.store.pipe(select(fromRoot.getLength));
    this.columns$ = this.store.pipe(select(fromRoot.getColumns));

    this.columnNames$ = this.columns$.pipe(
      map((columns: Array<{ name: string }>) => {
        let columnNames = columns.map(c => c.name);
        columnNames.unshift('select');
        return columnNames;
      })
    );

    this.pageIndex$ = this.store.pipe(
      select(fromRoot.getStart),
      withLatestFrom(this.pageSize$),
      map(([start, pageSize]) => {
        return start / pageSize;
      })
    );

    this.data$ = this.store.pipe(
      select(fromRoot.getRows),
      map(rows => {
        this.dataSource = new MatTableDataSource<Entity>(rows);
        this.selection.clear();
        return this.dataSource;
      })
    );

    this.store
      .pipe(select(fromRoot.getShowAddRow), skip(1))
      .subscribe(showAddRow => {
        if (showAddRow) {
          this.addRowDialogRef = this.dialog.open(EntityDialogComponent, {
            // width: '250px',
            data: {},
            disableClose: true
          });
        } else {
          this.addRowDialogRef.close();
        }
      });
  }

  ngOnInit() {
  }

  handlePageEvent(event) {
    this.store.dispatch(new router.UpdatePageOptions(event));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  toggleSelectAll(event) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeSelectedRows() {
    this.store.dispatch(new data.RemoveRows(this.selection.selected));
  }

  addEntity() {
    this.store.dispatch(new layout.ShowAddRow());
  }
}
