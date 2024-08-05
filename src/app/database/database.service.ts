import { Inject, Injectable } from "@angular/core";
import { RxCollection, RxDatabase, createRxDatabase } from 'rxdb';
import { APP_SETTINGS, AppSettings } from "../../appsettings";
import { HappenedTemplate, happenedTemplateSchema } from "./models/happened-template";
import { Happened, happenedMethods, happenedMigrations, happenedSchema } from "./models/happened";
import { addPlugins, getStorage } from "./database-env";
import { replicateCouchDB, getFetchWithCouchDBAuthorization } from 'rxdb/plugins/replication-couchdb';
import { RxReplicationState } from "rxdb/plugins/replication";

type HappenedTemplateCollection = RxCollection<HappenedTemplate>;
type HappenedCollection = RxCollection<Happened, typeof happenedMethods>;

type DatabaseCollections = {
    happened_template: HappenedTemplateCollection,
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
            methods: happenedMethods,
            migrationStrategies: happenedMigrations
        },
        happened_template: {
            schema: happenedTemplateSchema
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
