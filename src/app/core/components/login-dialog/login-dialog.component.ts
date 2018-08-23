import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as data from '../../actions/data';
import { Observable } from 'rxjs';

export interface DialogData {
  userName: string;
  password: string;
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginDialogComponent implements OnInit {

  userName: string;
  password: string;
  loginFailed$: Observable<boolean>

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private store: Store<fromRoot.State>
  ) {
    this.loginFailed$ = this.store.pipe(select(fromRoot.getLoginFailed));
  }

  ngOnInit() {
  }

  login() {
    this.store.dispatch(
      new data.Login(this.userName, this.password)
    );
  }
}