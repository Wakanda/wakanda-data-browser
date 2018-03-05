import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MaterialModule } from '../../../material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromRoot from '../../../reducers';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { Wakanda } from '../../../wakanda';
import * as data from '../../actions/data';
import * as layout from '../../actions/layout';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

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
    const wakandaSpy = {
      getCatalog: function () { }
    };

    spyOn(wakandaSpy, "getCatalog").and.returnValue(new Promise((resolve, reject) => {
      resolve(catalog);
    }));

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        StoreModule.forRoot(fromRoot.reducers)
      ],
      declarations: [
        AppComponent,
        DataTableStubComponent,
        CellStubComponent
      ],
      providers: [
        { provide: Wakanda, useValue: wakandaSpy }
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

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it('should call getCatalog of Wakanda service', async(() => {
    expect(wakandaServiceSpy.getCatalog).toHaveBeenCalled();
  }));

  it('should store the tables list in the tables member', async(() => {
    expect(fixture.componentInstance.tables).toEqual(['Employee', 'Company', 'User']);
  }));

  it('should dispatch an action to select the first table in the list', async(() => {
    expect(store.dispatch).toHaveBeenCalledWith(new data.SwitchTable('Employee'));
  }));

  it('should dispatch an action when switchTable is called', async(() => {
    app.switchTable('Company');
    expect(store.dispatch).toHaveBeenCalledWith(new data.SwitchTable('Company'));
  }));

  it('should display the sidenav by default', async(() => {
    app.showSidenav$.subscribe(value => {
      expect(value).toEqual(true);
    })
  }));

  it('should dispatch an action when toggleSideNav is called', async(() => {
    app.toggleSideNav();
    expect(store.dispatch).toHaveBeenCalledWith(new layout.ToggleSidenav());
    app.showSidenav$.subscribe(value => {
      expect(value).toEqual(false);
    });
  }));

  /**
   * UI tests
   */

  it('should render a sidenav', async(() => {
    expect(element.querySelector('mat-sidenav-container')).toBeTruthy();
  }));
  
  it('should have a list of available tables in the sidenav', async(() => {
    fixture.detectChanges();
    let items = debugElement.queryAll(By.css('mat-list-item'));
    let keys = Object.keys(catalog);

    expect(items.length).toEqual(keys.length);

    for (let i = 0; i < items.length; i++) {
      expect(items[i].nativeElement.textContent).toContain(keys[i]);
    }
  }));

  it('should call switchTable when a table name is clicked on the sidenav', async(() => {
    fixture.detectChanges();
    let items = debugElement.queryAll(By.css('mat-list-item'));


    let keys = Object.keys(catalog);
    
    spyOn(app, 'switchTable');

    items[1].triggerEventHandler('click', null);

    expect(app.switchTable).toHaveBeenCalledWith(keys[1]);
  }));

});
