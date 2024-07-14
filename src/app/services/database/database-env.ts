import { isDevMode } from "@angular/core";
import { addRxPlugin, RxStorage } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { wrappedKeyCompressionStorage } from "rxdb/plugins/key-compression";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";

export function addPlugins() {
  addRxPlugin(RxDBDevModePlugin);
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);
}

export function getStorage() {
  let storage: RxStorage<any, any> = wrappedKeyCompressionStorage({
    storage: getRxStorageDexie()
  })
  if (isDevMode())
    storage = wrappedValidateAjvStorage({
      storage: storage
    });
  return storage;
}