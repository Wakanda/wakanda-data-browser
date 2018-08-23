import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as data from '../../actions/data';

export interface DialogData {
  userName: string;
  password: string;
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  userName: string;
  password: string;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<fromRoot.State>) { }

  ngOnInit() {
  }

  login() {
    this.store.dispatch(new data.Login(this.userName, this.password));
  }
}
