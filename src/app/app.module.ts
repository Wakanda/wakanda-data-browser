import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer,
} from '@ngrx/router-store';

import { MaterialModule } from './material';

import { Wakanda } from './wakanda';
import { reducers } from './reducers';
import { routes } from './routes';
import { DataEffects } from './core/effects/data';
import { RouterEffects } from './core/effects/router';
import { CustomRouterStateSerializer } from './shared/utils';

import { AppComponent } from './core/containers/app/app.component';
import { DataTableComponent } from './core/components/data-table/data-table.component';
import { CellComponent } from './core/components/cell/cell.component';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    MaterialModule,
    FormsModule,
    EffectsModule.forRoot([DataEffects, RouterEffects]),
  ],
  providers: [
    Wakanda,
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
