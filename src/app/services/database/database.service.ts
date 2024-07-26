import { Inject, Injectable } from "@angular/core";
import { RxCollection, RxDatabase, createRxDatabase } from 'rxdb';
import { APP_SETTINGS, AppSettings } from "../../../appsettings";
import { HappenedType, happenedTypeSchema } from "../../models/happened-type";
import { Happened, happenedMethods, happenedSchema } from "../../models/happened";
import { addPlugins, getStorage } from "./database-env";
import { replicateCouchDB, getFetchWithCouchDBAuthorization } from 'rxdb/plugins/replication-couchdb';
import { RxReplicationState } from "rxdb/plugins/replication";

type HappenedTypeCollection = RxCollection<HappenedType>;
type HappenedCollection = RxCollection<Happened, typeof happenedMethods>;

type DatabaseCollections = {
    happened_types: HappenedTypeCollection,
    happened: HappenedCollection
};

export async function initDatabase(settings: AppSettings): Promise<void> {
    addPlugins();

    const db = await createRxDatabase<DatabaseCollections>({
        name: 'happened',
        storage: getStorage()
    });

    await db.addCollections({
        happened: {
            schema: happenedSchema,
            methods: happenedMethods
        },
        happened_types: {
            schema: happenedTypeSchema
        }
    });

    DB_INSTANCE = db;
}

let DB_INSTANCE: RxDatabase<DatabaseCollections>;

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    public db = DB_INSTANCE;
    public replicationStates: Record<string, RxReplicationState<any, any>>;

    constructor(@Inject(APP_SETTINGS) settings: AppSettings) {
        this.replicationStates = {};
        if (settings.couchdb && settings.couchdb.url) {
            const fetchMethod = settings.couchdb.username && settings.couchdb.password
                ? getFetchWithCouchDBAuthorization(settings.couchdb.username, settings.couchdb.password)
                : undefined;
            for (let collectionName in this.db.collections) {
                const collection = (this.db.collections as any)[collectionName] as RxCollection;
                let url = settings.couchdb.url + '/';
                if (settings.couchdb.prefix)
                    url += settings.couchdb.prefix + '_';
                url += collectionName + '/';
                this.replicationStates[collectionName] = replicateCouchDB({
                    replicationIdentifier: 'blocks-replication',
                    collection: collection,
                    url: url,
                    fetch: fetchMethod,
                    pull: {},
                    push: {},
                    live: true
                });
            }
        }
    }
}
