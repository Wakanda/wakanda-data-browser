import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRemoveRowsDialogComponent } from './confirm-remove-rows-dialog.component';

describe('ConfirmRemoveRowsDialogComponent', () => {
  let component: ConfirmRemoveRowsDialogComponent;
  let fixture: ComponentFixture<ConfirmRemoveRowsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmRemoveRowsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRemoveRowsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
