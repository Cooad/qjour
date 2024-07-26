import { bootstrapApplication } from '@angular/platform-browser';
import { provideNoopAnimations, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { APP_SETTINGS, AppSettings } from './appsettings';
import { APP_INITIALIZER, isDevMode } from '@angular/core';
import { initDatabase } from './app/services/database/database.service';

fetch('appsettings.json')
  .then<Response, AppSettings>(response => response.json())
  .catch<AppSettings>(error => ({}))
  .then(settings => bootstrapApplication(AppComponent, {
    providers: [
      provideAnimations(),
      provideRouter(routes),
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
      }),
      {
        provide: APP_SETTINGS,
        useValue: settings
      },
      {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [APP_SETTINGS],
        useFactory: (settings: AppSettings) => () => initDatabase(settings)
      }
    ]
  }))
  .catch((err) => console.error(err));
