import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/timeline-page/timeline-page.component').then(x => x.TimelinePageComponent) },
  { path: 'happened-types', loadComponent: () => import('./pages/happened-type-page/happened-type-page.component').then(x => x.HappenedTypePageComponent) },
  { path: '*', pathMatch: 'full', redirectTo: '' }
];