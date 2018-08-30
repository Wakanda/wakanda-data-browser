import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

@Component({
  selector: 'app-cell-storage-value',
  templateUrl: './cell-storage-value.component.html',
  styleUrls: ['./cell-storage-value.component.css']  
})
export class CellStorageValueComponent implements OnInit {

  @Input() column;
  @Input() value;

  imageDiagRef: MatDialogRef<ImageDialogComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit() { }

  isSimple() {
    return ['number', 'string'].indexOf(typeof (this.value)) >= 0;
  }

  previewImage() {
    this.imageDiagRef = this.dialog.open(ImageDialogComponent, {
      disableClose: true,
      id: 'image-dialog',
      data: {
        uri: this.value.uri,
      }
    });
  }

}