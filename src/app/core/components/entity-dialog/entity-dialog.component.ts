import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Entity from 'wakanda-client/dist/presentation/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColumnKinds } from '../../models/data';
import { Column } from '../../reducers/data';
import * as fromRoot from '../../../reducers';
import { Store, select } from '@ngrx/store';

export interface DialogData {

};

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css']
})
export class EntityDialogComponent implements OnInit {

  entity: Entity;
  columns$: Observable<Array<Column>>
  tableName$: Observable<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<EntityDialogComponent>,
    private store: Store<fromRoot.State>
  ) {
    this.tableName$ = this.store.pipe(select(fromRoot.getTableName));
    this.columns$ = this.store.pipe(
      select(fromRoot.getColumns),
      map(columns => {
        return columns.filter(column => {
          return [
            ColumnKinds.RelatedEntities,
            ColumnKinds.calculated
          ].indexOf(column.kind) === -1;
        });
      })
    );
  }

  ngOnInit() {
  }

}
