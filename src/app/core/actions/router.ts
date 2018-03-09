import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const enum RouterActionTypes {
  Go = '[Router] Go',
  Back = '[Router] Back',
  Forward = '[Router] Forward',
  SwitchTable = '[Router] Switch Table',
  UpdateQuery = '[Router] Update Query',
  UpdatePageOptions = '[Router] Update Page Options',
};

export class Go implements Action {
  readonly type = RouterActionTypes.Go;

  constructor(public payload: {
    path: any[];
    query?: object;
    extras?: NavigationExtras;
  }) { }
}

export class SwitchTable implements Action {
  readonly type = RouterActionTypes.SwitchTable;

  constructor(public table: string) { }
}

export class UpdateQuery implements Action {
  readonly type = RouterActionTypes.UpdateQuery;

  constructor(public query: string) { }
}

export class UpdatePageOptions implements Action {
  readonly type = RouterActionTypes.UpdatePageOptions;

  constructor(public options: { pageIndex: number, pageSize: number }) { }
}

export class Back implements Action {
  readonly type = RouterActionTypes.Back;
}

export class Forward implements Action {
  readonly type = RouterActionTypes.Forward;
}

export type RouterAction = Go | SwitchTable | UpdateQuery | UpdatePageOptions | Back | Forward;