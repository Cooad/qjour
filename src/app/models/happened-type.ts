import { RxJsonSchema } from "rxdb";

export type HappenedType = {
  id: string;
  title: string;
  metadataProperties: Record<string, "string" | "number">;
  createdAt: number;
  modifiedAt: number;
};

export const happenedTypeSchema: RxJsonSchema<HappenedType> = {
  title: 'happened type schema',
  description: 'describes happened type objects',
  version: 0,
  keyCompression: true,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    title: {
      type: 'string',
    },
    metadataProperties: {
      type: 'object',
    },
    createdAt: {
      type: 'integer',
    },
    modifiedAt: {
      type: 'integer'
    }
  },
  required: ['id', 'title', 'createdAt', 'modifiedAt']
};