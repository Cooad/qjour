import { Inject, Injectable } from "@angular/core";
import { RxCollection, RxDatabase, createRxDatabase } from 'rxdb';
import { APP_SETTINGS, AppSettings } from "../../../appsettings";
import { HappenedType, happenedTypeSchema } from "../../models/happenedType";
import { Happened, happenedSchema } from "../../models/happened";
import { addPlugins, getStorage } from "./database-env";

type HappenedTypeCollection = RxCollection<HappenedType>;
type HappenedCollection = RxCollection<Happened>;

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
            schema: happenedSchema
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
    //public replicationState;

    constructor(@Inject(APP_SETTINGS) settings: AppSettings) {
        // if (settings.couchdb && settings.couchdb.url) {
        //     const fetchMethod = settings.couchdb.username && settings.couchdb.password
        //         ? getFetchWithCouchDBAuthorization(settings.couchdb.username, settings.couchdb.password)
        //         : undefined;
        //     const blocksCollection = this.db.blocks;
        //     this.replicationState = replicateCouchDB({
        //         replicationIdentifier: 'blocks-replication',
        //         collection: blocksCollection,
        //         url: `${settings.couchdb.url}/${blocksCollection.name}/`,
        //         fetch: fetchMethod,
        //         pull: {},
        //         push: {},
        //         live: true
        //     });
        // }
    }
}
