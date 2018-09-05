import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import Entity from 'wakanda-client/dist/presentation/entity';

import { State } from '../../../reducers';
import * as data from '../../actions/data';

interface DialogData {
  rows: Array<Entity>;
};

@Component({
  selector: 'app-confirm-remove-rows-dialog',
  templateUrl: './confirm-remove-rows-dialog.component.html',
  styleUrls: ['./confirm-remove-rows-dialog.component.css']
})
export class ConfirmRemoveRowsDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ConfirmRemoveRowsDialogComponent>,
    private store: Store<State>
  ) { }

  ngOnInit() {
  }

  confirm() {
    this.store.dispatch(new data.ConfirmRemoveRows(this.data.rows));
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
