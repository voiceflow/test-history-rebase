import { PrimaryKey } from '@mikro-orm/core';
import type { ObjectId } from '@mikro-orm/mongodb';

import { DEFAULT_OR_NULL_COLUMN, type MongoPKEntity, type ToJSON, type ToObject } from '@/types';

export abstract class MongoEntity implements MongoPKEntity {
  @PrimaryKey()
  _id!: ObjectId;

  [DEFAULT_OR_NULL_COLUMN]?: '_id';
}

export type MongoObject = ToObject<MongoEntity>;
export type MongoJSON = ToJSON<MongoObject>;
