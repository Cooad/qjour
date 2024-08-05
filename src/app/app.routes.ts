import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/timeline-page/timeline-page.component').then(x => x.TimelinePageComponent) },
  { path: 'templates', loadComponent: () => import('./pages/templates-page/templates-page.component').then(x => x.TemplatesPageComponent) },
  { path: '*', pathMatch: 'full', redirectTo: '' }
];