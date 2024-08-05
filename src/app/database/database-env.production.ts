import { addRxPlugin, RxStorage } from "rxdb";
import { wrappedKeyCompressionStorage } from "rxdb/plugins/key-compression";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';

export function addPlugins() {
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);
  addRxPlugin(RxDBMigrationSchemaPlugin);
}
export function getStorage() {
  let storage: RxStorage<any, any> = wrappedKeyCompressionStorage({
    storage: getRxStorageDexie()
  })
  return storage;
}