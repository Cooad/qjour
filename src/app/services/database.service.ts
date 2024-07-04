import { Injectable } from "@angular/core";
import { ExtractDocumentTypeFromTypedRxJsonSchema, RxCollection, RxJsonSchema, addRxPlugin, createRxDatabase, toTypedRxJsonSchema } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateCouchDB, getFetchWithCouchDBAuthorization } from 'rxdb/plugins/replication-couchdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';

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

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    public blocks: Promise<RxCollection<BlockType>> = this.createBlocksCollection();

    private async createBlocksCollection(): Promise<RxCollection<BlockType>> {
        addRxPlugin(RxDBDevModePlugin);
        addRxPlugin(RxDBQueryBuilderPlugin);
        addRxPlugin(RxDBLeaderElectionPlugin);
        const db = await createRxDatabase<DatabaseCollections>({
            name: 'blocks',
            storage: getRxStorageDexie()
        });
        const que = await db.addCollections({
            blocks: {
                schema: blockSchema
            }
        });
        return que.blocks;
    }

    public async startRepication(){
        const blocksCollection = await this.blocks;
        const replicationState = replicateCouchDB({
            replicationIdentifier: 'first-test',
            collection: blocksCollection,
            url: '',
            pull:{},
            push:{},
            fetch: getFetchWithCouchDBAuthorization('','')
        });
        return replicationState;
    }
}
