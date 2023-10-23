import { Property } from '@mikro-orm/core';

import { MongoEntity } from './mongo.entity';

export abstract class MongoCreatableEntity extends MongoEntity {
  @Property({ onCreate: () => Date.now() })
  createdAt!: number;
}
