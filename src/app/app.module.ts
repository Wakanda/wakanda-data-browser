import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from './material';

import { Wakanda } from './wakanda';
import { AppComponent } from './core/containers/app/app.component';
import { DataTableComponent } from './core/components/data-table/data-table.component';
import { reducers } from './reducers';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    MaterialModule,
    FormsModule,    
  ],
  providers: [Wakanda],
  bootstrap: [AppComponent]
})
export class AppModule { }
