import { InjectionToken } from "@angular/core";

export type AppSettings = {
  couchdb?: CouchDbSettings;
}

type CouchDbSettings = {
  url: string;
  username?: string;
  password?: string;
  prefix?:string;
}

export const APP_SETTINGS = new InjectionToken<AppSettings>('AppSettings');