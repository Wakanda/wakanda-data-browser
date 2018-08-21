import { NgModule } from '@angular/core';

import {
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatMenuModule
} from '@angular/material';

@NgModule({
    imports: [
        MatSidenavModule,
        MatButtonModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatCheckboxModule,
        MatMenuModule,
    ],
    exports: [
        MatSidenavModule,
        MatButtonModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatCheckboxModule,
        MatMenuModule,
    ]
})
export class MaterialModule { };