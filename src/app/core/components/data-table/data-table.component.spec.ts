import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../material'

import * as data from '../../actions/data';
import { ColumnTypes, ColumnKinds } from '../../models/data';

import * as fromRoot from '../../../reducers';
import { DataTableComponent } from './data-table.component';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import { By } from '@angular/platform-browser';

@Component({ selector: 'app-cell', template: '' })
class CellComponentStub {
  @Input() column;
  @Input() value;
}

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;
  let store: Store<fromRoot.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableComponent, CellComponentStub],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        StoreModule.forRoot(fromRoot.reducers),
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Dispatches
   */

  it('should dispatch an action when handlePageEvent is called', async(() => {
    let event = { pageIndex: 0, pageSize: 20, length: 30 };
    component.handlePageEvent(event);
    expect(store.dispatch).toHaveBeenCalledWith(new data.ChangeOptions(event));
  }));

  it('should dispatch an action when queryStringChange is called', async(() => {
    let queryString = 'firstname == "E*"';
    component.queryStringChange({ currentTarget: { value: queryString } });
    expect(store.dispatch).toHaveBeenCalledWith(new data.SetQuery(queryString));
  }));

  it('should dispatch an action when resetQuery is called', async(() => {
    component.resetQuery();
    expect(store.dispatch).toHaveBeenCalledWith(new data.ResetQuery());
  }));

  it('should dispatch an action when refreshResult is called', async(() => {
    component.refreshResult();
    expect(store.dispatch).toHaveBeenCalledWith(new data.FetchData());
  }));

  /**
   * Subscriptions
   */

  it('should receive page updates', async(() => {
    let event = { pageIndex: 1, pageSize: 30, length: 50 };
    store.dispatch(new data.ChangeOptions(event));

    component.pageSize$
      .first()
      .withLatestFrom(component.pageIndex$)
      .subscribe(([pageSize, pageIndex]) => {
        expect(pageSize).toEqual(30);
        expect(pageIndex).toEqual(1);
      });
  }));

  it('should receive query updates', async(() => {
    let queryString = 'lastname == "Ab*"';
    store.dispatch(new data.SetQuery(queryString));

    component.query$
      .first()
      .subscribe(query => {
        expect(query).toEqual(queryString);
      });
  }));

  it('should receive query reset', async(() => {
    store.dispatch(new data.ResetQuery());
    component.query$
      .first()
      .subscribe(query => {
        expect(query.length).toEqual(0);
      });
  }));

  it('should receive data updates', async(() => {
    let d = {
      entities: [{
        ID: 1,
        firstname: "John",
        lastname: "Doe",
        manager: true
      }],
      length: 1
    };
    store.dispatch(new data.UpdateData(d));
    component.data$
      .first()
      .withLatestFrom(component.length$)
      .subscribe(([data, length]) => {
        expect(data.data).toEqual(d.entities);
        expect(length).toEqual(1);
      });
  }));

  it('should receive column names updates', async(() => {
    let c = [
      {
        name: 'ID',
        kind: ColumnKinds.Storage,
        type: ColumnTypes.Long,
      },
      {
        name: 'firstname',
        kind: ColumnKinds.Storage,
        type: ColumnTypes.String,
      },
      {
        name: 'lastname',
        kind: ColumnKinds.Storage,
        type: ColumnTypes.String,
      },
      {
        name: 'manager',
        kind: ColumnKinds.Storage,
        type: ColumnTypes.Boolean,
      },
    ];
    let names = ['ID', 'firstname', 'lastname', 'manager'];

    store.dispatch(new data.UpdateColumns(c));

    component.columnNames$
      .first()
      .subscribe(columnNames => {
        expect(columnNames).toEqual(names);
      });

    component.columns$
      .first()
      .subscribe(columns => {
        expect(columns).toEqual(c);
      });
  }));

  /**
   * UI
   */

  it('should update the query input when state changes', async(() => {
    let queryString = 'lastname == "D*"';
    store.dispatch(new data.SetQuery(queryString));

    component.query$
      .first()
      .subscribe(query => {
        fixture.detectChanges();
        let value = debugElement.query(By.css('input.query')).nativeElement.value;
        expect(value).toEqual(queryString);
      });
  }));

  it('should call refreshResult when refresh button is clicked', async(() => {
    let refreshButton = debugElement.query(By.css('button.refresh'));
    spyOn(component, 'refreshResult');
    refreshButton.triggerEventHandler('click', null);
    expect(component.refreshResult).toHaveBeenCalledTimes(1);
  }));

  it('should have a reset button when query is not empty', async(() => {
    let clearButton = debugElement.query(By.css('button.clear'));
    
    expect(clearButton === null).toBeTruthy();
    
    let queryString = 'lastname == "D*"';
    store.dispatch(new data.SetQuery(queryString));

    component.query$
      .first()
      .subscribe(query => {
        fixture.detectChanges();
        clearButton = debugElement.query(By.css('button.clear'));
        expect(clearButton === null).toBeFalsy();
      });
  }));

  it('should call resetQuery when reset button is clicked', async(() => {
    let queryString = 'lastname == "D*"';
    store.dispatch(new data.SetQuery(queryString));

    component.query$
      .first()
      .subscribe(query => {
        fixture.detectChanges();
        let clearButton = debugElement.query(By.css('button.clear'));

        spyOn(component, 'resetQuery');
        
        clearButton.triggerEventHandler('click', null);
        expect(component.resetQuery).toHaveBeenCalledTimes(1);
      });
  }));

});
