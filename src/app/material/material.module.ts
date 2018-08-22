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
    MatMenuModule,
    MatDialogModule,
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
        MatDialogModule,
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
        MatDialogModule,
    ]
})
export class MaterialModule { };