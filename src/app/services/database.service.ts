import { Inject, Injectable, OnDestroy, OnInit, inject, isDevMode } from "@angular/core";
import { ExtractDocumentTypeFromTypedRxJsonSchema, RxCollection, RxDatabase, RxJsonSchema, addRxPlugin, createRxDatabase, toTypedRxJsonSchema } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateCouchDB, getFetchWithCouchDBAuthorization } from 'rxdb/plugins/replication-couchdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { APP_SETTINGS, AppSettings } from "../../appsettings";

const schamaLiteral = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        title: {
            type: 'string'
        },
        text: {
            type: 'string'
        },
        created: {
            type: "integer"
        }
    },
    required: ['id']
} as const;
const schemaTyped = toTypedRxJsonSchema(schamaLiteral);
export type BlockType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const blockSchema: RxJsonSchema<BlockType> = schamaLiteral;

type BlocksCollection = RxCollection<BlockType>;
type DatabaseCollections = {
    blocks: BlocksCollection
};

export async function initDatabase(settings: AppSettings): Promise<void> {
    if (isDevMode())
        addRxPlugin(RxDBDevModePlugin);
    addRxPlugin(RxDBQueryBuilderPlugin);
    addRxPlugin(RxDBLeaderElectionPlugin);

    const db = await createRxDatabase<DatabaseCollections>({
        name: 'blocks',
        storage: getRxStorageDexie()
    });
    await db.addCollections({
        blocks: {
            schema: blockSchema
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
    public replicationState;

    constructor(@Inject(APP_SETTINGS) settings: AppSettings) {
        if (settings.couchdb && settings.couchdb.url) {
            const fetchMethod = settings.couchdb.username && settings.couchdb.password
                ? getFetchWithCouchDBAuthorization(settings.couchdb.username, settings.couchdb.password)
                : undefined;
            const blocksCollection = this.db.blocks;
            this.replicationState = replicateCouchDB({
                replicationIdentifier: 'blocks-replication',
                collection: blocksCollection,
                url: `${settings.couchdb.url}/${blocksCollection.name}/`,
                fetch: fetchMethod,
                pull: {},
                push: {},
                live:true
            });
        }
    }
}
