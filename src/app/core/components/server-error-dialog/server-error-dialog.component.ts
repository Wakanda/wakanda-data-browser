import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface Options {
  noActions?: boolean;
}

export interface DialogData {
  title: string;
  message: string;
  operation: { description: string };
  callToAction?: string;
  options: Options;
}

@Component({
  selector: 'app-server-error-dialog',
  templateUrl: './server-error-dialog.component.html',
  styleUrls: ['./server-error-dialog.component.css']
})
export class ServerErrorDialogComponent implements OnInit {

  options: Options = {
    noActions: false
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<ServerErrorDialogComponent>
  ) {
    this.data = this.data || <DialogData>{ operation: {} };
    this.data.title = (typeof this.data.title === 'string') ? this.data.title : 'Server Error';
    let receivedOptions = this.data.options || {};

    this.options = {
      ...this.options,
      ...receivedOptions
    };
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
