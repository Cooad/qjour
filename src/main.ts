import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { APP_SETTINGS, AppSettings } from './appsettings';
import { APP_INITIALIZER } from '@angular/core';
import { initDatabase } from './app/services/database.service';

fetch('appsettings.json')
  .then<Response, AppSettings>(response => response.json())
  .catch<AppSettings>(error => ({}))
  .then(settings => bootstrapApplication(AppComponent, appConfig([
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
  ])))
  .catch((err) => console.error(err));
