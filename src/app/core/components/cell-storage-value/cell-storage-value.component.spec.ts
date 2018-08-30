import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellStorageValueComponent } from './cell-storage-value.component';

describe('CellStorageValueComponent', () => {
  let component: CellStorageValueComponent;
  let fixture: ComponentFixture<CellStorageValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellStorageValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellStorageValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
