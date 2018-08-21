import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../material'
import { first, withLatestFrom } from 'rxjs/operators';

import * as dataActions from '../../actions/data';
import * as routerActions from '../../actions/router';
import { ColumnTypes, ColumnKinds } from '../../models/data';
import { testData } from './testData';

import * as fromRoot from '../../../reducers';
import { DataTableComponent } from './data-table.component';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

@Component({ selector: 'app-cell', template: '' })
class CellComponentStub {
  @Input() column;
  @Input() value;
  @Input() entity;

  constructor(private store: Store<fromRoot.State>) { }
}

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;
  let store: Store<fromRoot.State>;
  let testColumns = [
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
  let testColumnNames = ['select' /*selection column*/, 'ID', 'firstname', 'lastname', 'manager'];

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

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * The behavior of the component is unspecified
   * when the datasource length exceeds the page size.
   * The test data should respect this requirement.
   */
  it('should have a default pageSize of testData.entities.length', async(() => {
    component.pageSize$.pipe(first())
      .subscribe((pageSize) => {
        expect(pageSize).toEqual(testData.entities.length);
      });
  }));

  /**
   * Dispatches
   */

  it('should dispatch an action when handlePageEvent is called', async(() => {
    let event = { pageIndex: 0, pageSize: 20, length: 30 };
    component.handlePageEvent(event);
    expect(store.dispatch).toHaveBeenCalledWith(new routerActions.UpdatePageOptions(event));
  }));

  it('should dispatch an action when queryStringChange is called', async(() => {
    let queryString = 'firstname == "E*"';
    component.queryStringChange({ currentTarget: { value: queryString } });
    expect(store.dispatch).toHaveBeenCalledWith(new routerActions.UpdateQuery(queryString));
  }));

  it('should dispatch an action when resetQuery is called', async(() => {
    component.resetQuery();
    expect(store.dispatch).toHaveBeenCalledWith(new routerActions.UpdateQuery(''));
  }));

  it('should dispatch an action when refreshResult is called', async(() => {
    component.refreshResult();
    expect(store.dispatch).toHaveBeenCalledWith(new dataActions.FetchData());
  }));

  /**
   * Subscriptions
   */

  it('should receive page updates', async(() => {
    let event = { pageIndex: 1, pageSize: 30, length: 50 };
    store.dispatch(new dataActions.ChangeOptions(event));

    component.pageSize$.pipe(
      first(),
      withLatestFrom(component.pageIndex$)
    )
      .subscribe(([pageSize, pageIndex]) => {
        expect(pageSize).toEqual(30);
        expect(pageIndex).toEqual(1);
      });
  }));

  it('should receive query updates', async(() => {
    let queryString = 'lastname == "Ab*"';
    store.dispatch(new dataActions.ChangeOptions({ query: queryString }));

    component.query$.pipe(first())
      .subscribe(query => {
        expect(query).toEqual(queryString);
      });
  }));

  it('should receive query reset', async(() => {
    store.dispatch(new dataActions.ChangeOptions({ query: '' }));
    component.query$.pipe(first())
      .subscribe(query => {
        expect(query.length).toEqual(0);
      });
  }));

  it('should receive data updates', async(() => {
    store.dispatch(new dataActions.UpdateData(testData));
    component.data$.pipe(
      first(),
      withLatestFrom(component.length$)
    )
      .subscribe(([data, length]: [any, number]) => {
        expect(data.data).toEqual(testData.entities);
        expect(length).toEqual(testData.length);
        // testData is chosen in order for this condition to be true
        expect(length).not.toEqual(testData.entities.length);
      });
  }));

  it('should receive column names updates', async(() => {
    store.dispatch(new dataActions.UpdateColumns(testColumns));

    component.columnNames$.pipe(first())
      .subscribe(columnNames => {
        expect(columnNames).toEqual(testColumnNames);
      });

    component.columns$.pipe(first())
      .subscribe(columns => {
        expect(columns).toEqual(testColumns);
      });
  }));

  /**
   * UI
   */

  it('should update the query input when query$ changes', async(() => {
    let queryString = 'lastname == "D*"';
    store.dispatch(new dataActions.ChangeOptions({ query: queryString }));

    component.query$.pipe(first())
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

  it('should have a reset button when query$ is not empty', async(() => {
    let clearButton = debugElement.query(By.css('button.clear'));

    expect(clearButton === null).toBeTruthy();

    let queryString = 'lastname == "D*"';
    store.dispatch(new dataActions.ChangeOptions({ query: queryString }));

    component.query$.pipe(first())
      .subscribe(query => {
        fixture.detectChanges();
        clearButton = debugElement.query(By.css('button.clear'));
        expect(clearButton === null).toBeFalsy();
      });
  }));

  it('should call resetQuery when reset button is clicked', async(() => {
    let queryString = 'lastname == "D*"';
    store.dispatch(new dataActions.ChangeOptions({ query: queryString }));

    component.query$.pipe(first())
      .subscribe(query => {
        fixture.detectChanges();
        let clearButton = debugElement.query(By.css('button.clear'));

        spyOn(component, 'resetQuery');

        clearButton.triggerEventHandler('click', null);
        expect(component.resetQuery).toHaveBeenCalledTimes(1);
      });
  }));

  it('should update columns when columns$ changes', async(() => {

    store.dispatch(new dataActions.UpdateColumns(testColumns));

    component.columnNames$.pipe(first())
      .subscribe(columnNames => {
        fixture.detectChanges();
        expect(debugElement.queryAll(By.css('mat-header-cell')).length).toEqual(columnNames.length);
        debugElement.queryAll(By.css('mat-header-cell'))
          .forEach((element, index) => {
            if (index === 0) {
              expect(element.queryAll(By.css('mat-checkbox')).length).toEqual(1);
            } else {
              expect(element.nativeElement.textContent).toContain(columnNames[index]);
            }
          });
      });
  }));

  it('should update rows data when data$ changes', async(() => {
    store.dispatch(new dataActions.UpdateData(testData));
    component.data$.pipe(
      first(),
      withLatestFrom(component.length$)
    )
      .subscribe(([data, length]) => {
        fixture.detectChanges();
        let rows = debugElement.queryAll(By.css('mat-row'));
        expect(rows.length).toEqual(testData.entities.length);
        expect(debugElement.query(By.css('mat-paginator')).componentInstance.length).toEqual(testData.length);

        // let firstRowCells = rows[0].queryAll(By.css('mat-cell'));
        // expect(firstRowCells.length).toEqual(testColumnNames.length + 1);
        // firstRowCells
        //   .forEach(cell => {

        //   });
      });
  }));

});
