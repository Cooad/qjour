import { RxDocument, RxJsonSchema } from "rxdb";
import { from } from "rxjs";
import { HappenedTypeDocument } from "./happened-type";

export type Happened = {
  id: string;
  type: string;
  metadata: Record<string, any>
  happenedAt: number;
  createdAt: number;
  modifiedAt: number;
};

export const happenedMethods = {
}

export type HappenedDocument = RxDocument<Happened, typeof happenedMethods>;

export const happenedSchema: RxJsonSchema<Happened> = {
  title: 'happened schema',
  description: 'describes happened objects',
  version: 0,
  keyCompression: true,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    type: {
      type: 'string',
      ref: 'happened_types'
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
  required: ['id', 'type', 'createdAt', 'modifiedAt', 'happenedAt'],
  indexes: ['happenedAt']
};

