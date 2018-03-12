import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { MaterialModule } from '../../../material';

import * as fromRoot from '../../../reducers';
import { Wakanda } from '../../../wakanda';
import * as dataActions from '../../actions/data';
import * as layout from '../../actions/layout';
import * as routerActions from '../../actions/router';



@Component({ selector: 'app-data-table', template: '' })
class DataTableStubComponent { }
@Component({ selector: 'app-cell', template: '' })
class CellStubComponent { }

describe('AppComponent', () => {

  let wakandaServiceSpy: jasmine.SpyObj<Wakanda>;
  let store: Store<fromRoot.State>;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let element: HTMLElement;
  let debugElement: DebugElement;
  let catalog = {
    "Employee": {},
    "Company": {},
    "User": {},
  };

  beforeEach(async(() => {
    const wakandaStub = {
      getCatalog: function () { }
    };

    spyOn(wakandaStub, "getCatalog").and.returnValue(new Promise((resolve, reject) => {
      resolve(catalog);
    }));

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        StoreModule.forRoot(fromRoot.reducers),
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        DataTableStubComponent,
        CellStubComponent
      ],
      providers: [
        { provide: Wakanda, useValue: wakandaStub }
      ]
    }).compileComponents();

    wakandaServiceSpy = TestBed.get(Wakanda);

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    debugElement = fixture.debugElement;
    element = fixture.nativeElement;
    app = fixture.componentInstance;
  }));

  /**
   * Initialization
   */

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it('should display the sidenav by default', async(() => {
    app.showSidenav$
      .first()
      .subscribe(value => {
        expect(value).toEqual(true);
      });
  }));

  /**
   * Subscriptions
   */

  it('should receive current table updates', async(() => {
    let table = 'Employee';
    store.dispatch(new dataActions.ChangeOptions({ tableName: table }));

    app.tableName$
      .first()
      .subscribe(tableName => {
        expect(tableName).toEqual(table);
      });
  }));

  it('should receive the tables list', async(() => {
    let tables = Object.keys(catalog);
    store.dispatch(new dataActions.UpdateTables(tables));

    app.tables$
      .first()
      .subscribe(data => {
        expect(data).toEqual(tables);
      });
  }));

  it('should receive sidenav state updates', async(() => {
    store.dispatch(new layout.ToggleSidenav());

    app.showSidenav$
      .first()
      .map(value => {
        store.dispatch(new layout.ToggleSidenav());
        return value;
      })
      .withLatestFrom(app.showSidenav$)
      .subscribe(([v1, v2]) => {
        expect(typeof v1).toEqual('boolean');
        expect(typeof v2).toEqual('boolean');
        expect(v1).toEqual(!v2);
      });
  }));

  /**
   * Dispatches
   */

  it('should dispatch an action when switchTable is called', async(() => {
    app.switchTable('Company');
    expect(store.dispatch).toHaveBeenCalledWith(new routerActions.SwitchTable({table: 'Company'}));
  }));

  it('should dispatch an action when toggleSideNav is called', async(() => {
    app.toggleSideNav();
    expect(store.dispatch).toHaveBeenCalledWith(new layout.ToggleSidenav());
    app.showSidenav$
      .first()
      .subscribe(value => {
        expect(value).toEqual(false);
      })
  }));

  /**
   * UI
   */

  it('should render a sidenav', async(() => {
    expect(element.querySelector('mat-sidenav-container')).toBeTruthy();
  }));

  it('should have a list of available tables in the sidenav', async(() => {
    let tables = Object.keys(catalog);
    store.dispatch(new dataActions.UpdateTables(tables));

    fixture.detectChanges();
    let items = debugElement.queryAll(By.css('mat-list-item'));
    let keys = Object.keys(catalog);

    expect(items.length).toEqual(keys.length);

    items.forEach((item, index) => {
      expect(item.nativeElement.textContent).toContain(keys[index]);
    })
  }));

  it('should call switchTable when a table name is clicked on the sidenav', async(() => {
    let tables = Object.keys(catalog);
    store.dispatch(new dataActions.UpdateTables(tables));
    fixture.detectChanges();

    let items = debugElement.queryAll(By.css('mat-list-item'));

    spyOn(app, 'switchTable');

    items[1].triggerEventHandler('click', null);

    expect(app.switchTable).toHaveBeenCalledWith(tables[1]);
  }));

  it('should call toggleSideNav when one of the two menu buttons is clicked', async(() => {
    fixture.detectChanges();
    let items = debugElement.queryAll(By.css('button.menu-toggle'));

    expect(items.length).toBeGreaterThan(0);

    spyOn(app, 'toggleSideNav');

    items.forEach((item, index) => {
      item.triggerEventHandler('click', null);
      expect(app.toggleSideNav).toHaveBeenCalledTimes(index + 1);
    });
  }));

});