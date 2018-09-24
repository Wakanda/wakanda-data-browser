import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const enum RouterActionTypes {
  Go = '[Router] Go',
  Back = '[Router] Back',
  Forward = '[Router] Forward',
  SwitchTable = '[Router] Switch Table',
  UpdateQuery = '[Router] Update Query',
  UpdatePageOptions = '[Router] Update Page Options',
  Initialize = '[Router] Initialize',
  UpdateOrder = '[Router] OrderBy',
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

  constructor(public params: { table: string, query?: string }) { }
}

export class UpdateQuery implements Action {
  readonly type = RouterActionTypes.UpdateQuery;

  constructor(public query: string) { }
}

export class UpdateOrder implements Action {
  readonly type = RouterActionTypes.UpdateOrder;

  constructor(public sortBy: string, public sortDirection: string) { }
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

export class Initialize implements Action {
  readonly type = RouterActionTypes.Initialize;
}

export type RouterAction = Go | SwitchTable
  | UpdateQuery | UpdatePageOptions | UpdateOrder
  | Back | Forward | Initialize;