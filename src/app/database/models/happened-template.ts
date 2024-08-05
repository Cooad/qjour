import { RxDocument, RxJsonSchema } from "rxdb";
import { Happened } from "./happened";

export type HappenedTemplate = Omit<Happened, 'happenedAt'>;

export type HappenedTemplateDocument = RxDocument<HappenedTemplate>;

export const happenedTemplateSchema: RxJsonSchema<HappenedTemplate> = {
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
    type: {
      type: 'string'
    },
    metadata: {
      type: 'object',
    },
    createdAt: {
      type: 'integer',
    },
    modifiedAt: {
      type: 'integer'
    }
  },
  required: ['id', 'title', 'type', 'createdAt', 'modifiedAt']
};