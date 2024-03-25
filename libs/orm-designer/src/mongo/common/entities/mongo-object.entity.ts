import { Property } from '@mikro-orm/core';

import type { ToJSON, ToObject } from '@/types';

import { MongoEntity } from './mongo.entity';

export abstract class MongoObjectEntity extends MongoEntity {
  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;
}

export type MongoObjectObject = ToObject<MongoObjectEntity>;
export type MongoObjectJSON = ToJSON<MongoObjectObject>;
