import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromRoot from '../../../reducers';
import { MaterialModule } from '../../../material'

import { DataTableComponent } from './data-table.component';

@Component({ selector: 'app-cell', template: '' })
class CellComponentStub { 
  @Input() column;
  @Input() value;
}

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

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
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
