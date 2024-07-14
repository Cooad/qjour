import { addRxPlugin, RxStorage } from "rxdb";
import { wrappedKeyCompressionStorage } from "rxdb/plugins/key-compression";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

export function addPlugins() {
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);
}

export function getStorage() {
  let storage: RxStorage<any, any> = wrappedKeyCompressionStorage({
    storage: getRxStorageDexie()
  })
  return storage;
}