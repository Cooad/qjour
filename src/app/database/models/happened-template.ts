import { RxDocument, RxJsonSchema } from "rxdb";
import { Happened } from "./happened";

type Base = {
  id: string;
  title: string;
  createdAt: number;
  modifiedAt: number;
}

export type HappenedSimple = {
  type: 'simple',
  metadata: {
    note?: string;
  }
} & Base;

export function isSimpleType(input: HappenedTemplate | undefined): input is HappenedSimple {
  if (!input)
    return false;
  if (!input.type)
    return false;
  return input.type === 'simple';
}

export type HappenedRating = {
  type: 'rating',
  metadata: {
    rating: number
  }
} & Base;

export function isRatingType(input: HappenedTemplate | undefined): input is HappenedRating {
  if (!input)
    return false;
  if (!input.type)
    return false;
  return input.type === 'rating';
}

export type HappenedTemplate = HappenedSimple | HappenedRating;

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