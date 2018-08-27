import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { LoginDialogComponent } from './login-dialog.component';
import { MaterialModule } from '../../../material'
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';
import { first } from 'rxjs/operators';
import { By } from '@angular/platform-browser';

import * as fromRoot from '../../../reducers'
import * as dataActions from '../../actions/data';
import * as layoutActions from '../../actions/layout';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;
  let store: Store<fromRoot.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginDialogComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        StoreModule.forRoot(fromRoot.reducers)
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
      .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  /**
   * Defaults
   */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default loginFailed of false', async(() => {
    component.loginFailed$.pipe(first())
      .subscribe(loginFailed => {
        expect(loginFailed).toEqual(false);
      });
  }));

  /**
   * Dispatches
   */

  it('should dispatch an action when the login method is called', async(() => {
    let userName = 'John';
    let password = `Johny's password`;
    component.userName = userName;
    component.password = password;
    component.login();
    expect(store.dispatch).toHaveBeenCalledWith(new dataActions.Login(userName, password));
  }));

  /**
   * Subscriptions
   */

  it('should receive loginFailed updates', async(() => {
    store.dispatch(new layoutActions.LoginFailure());
    component.loginFailed$.pipe(first())
      .subscribe(loginFailed => {
        expect(loginFailed).toEqual(true);
      });
  }));

  /**
   * UI
   */

  it('should call login when login button is clicked', async(() => {
    let loginButton = debugElement.query(By.css('button.login'));
    spyOn(component, 'login');
    loginButton.triggerEventHandler('click', null);
    expect(component.login).toHaveBeenCalledTimes(1);
  }));

  it('should reflect login failure on form-fields', async(() => {
    store.dispatch(new layoutActions.LoginFailure());
    fixture.detectChanges();
    let fields = debugElement.queryAll(By.css('mat-form-field'));
    expect(fields[0].classes.warn).toEqual(true);
    expect(fields[1].classes.warn).toEqual(true);
  }));
});
