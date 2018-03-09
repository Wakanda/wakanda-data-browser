import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'query=:query&table=:table', redirectTo: '/', pathMatch: 'full' },
];
