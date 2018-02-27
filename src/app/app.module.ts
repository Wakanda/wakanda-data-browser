import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatSidenavModule,
  MatButtonModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { AppComponent } from './app.component';

@NgModule({
  exports: [
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ]
})
export class AngularMaterialModule {}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
