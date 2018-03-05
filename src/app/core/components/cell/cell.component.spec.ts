import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '../../../material';

import { CellComponent } from './cell.component';

describe('AppCellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CellComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    component.column = {
      kind: "storage",
      type: "bool",
    };
    component.value = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
