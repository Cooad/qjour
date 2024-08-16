import { MigrationStrategies, RxDocument, RxJsonSchema } from "rxdb";
import { HappenedTemplate } from "./happened-template";


export type Happened = HappenedTemplate & { happenedAt: number };

export const happenedMethods = {
}

export type HappenedDocument = RxDocument<Happened, typeof happenedMethods>;

export const happenedSchema: RxJsonSchema<Happened> = {
  title: 'happened schema',
  description: 'describes happened objects',
  version: 1,
  keyCompression: true,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    type: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    metadata: {
      type: 'object',
    },
    happenedAt: {
      type: 'integer',
      multipleOf: 1,
      minimum: 949359600000,
      maximum: 7260793200000
    },
    createdAt: {
      type: 'integer',
    },
    modifiedAt: {
      type: 'integer',
    }
  },
  required: ['id', 'type', 'title', 'createdAt', 'modifiedAt', 'happenedAt'],
  indexes: ['happenedAt']
};

export const happenedMigrations: MigrationStrategies = {
  1: function (oldHappened): Happened | Promise<Happened> | null {
    return null;
  }
}