import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as routerActions from '../../actions/router';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent implements OnInit {

  @Input() column;
  @Input() value;
  @Input() entity;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() { }

  displayRelatedEntity() {
    let table = this.value._dataClass;
    let tableName = table.name;
    let idFieldName = table.attributes.filter(element => {
      return element.identifying === true;
    })[0].name;
    let query = `${idFieldName} === ${this.value._key}`;

    this.store.dispatch(new routerActions.SwitchTable({ table: tableName, query }));
  }

  displayRelatedEntities() {
    let table = this.value._dataClass;
    let tableName = table.name;
    let path = this.column.path;
    let query = `${path} === ${this.entity._key}`;

    this.store.dispatch(new routerActions.SwitchTable({ table: tableName, query }));
  }

}
