import { Routes } from '@angular/router';

export const routes: Routes = [
  //{ path: '', component: HappenedPageComponent },
  { path: '', loadComponent: () => import('./pages/happened-page/happened-page.component').then(x => x.HappenedPageComponent) },
  { path: 'happened-types', loadComponent: () => import('./pages/happened-type-page/happened-type-page.component').then(x => x.HappenedTypePageComponent) },
  { path: '*', pathMatch: 'full', redirectTo: '' }
];