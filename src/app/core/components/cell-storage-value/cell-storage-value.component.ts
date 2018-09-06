import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { Config } from '../../../config';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';

import * as layout from '../../actions/layout';

@Component({
  selector: 'app-cell-storage-value',
  templateUrl: './cell-storage-value.component.html',
  styleUrls: ['./cell-storage-value.component.css']
})
export class CellStorageValueComponent implements OnInit {

  @Input() column;
  @Input() value;

  imageDiagRef: MatDialogRef<ImageDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private config: Config,
    private store: Store<State>
  ) { }

  ngOnInit() { }

  isSimple() {
    return ['number', 'string'].indexOf(typeof (this.value)) >= 0;
  }

  previewImage() {
    this.store.dispatch(new layout.ShowImage(this.getImageURL()));
  }

  getImageURL() {
    return (this.config.host + '/' + this.value.uri).replace(/([^:]\/)\/+/g, "$1");
  }

  getBlobURL() {
    return (this.config.host + '/' + this.value.uri).replace(/([^:]\/)\/+/g, "$1");
  }

}
