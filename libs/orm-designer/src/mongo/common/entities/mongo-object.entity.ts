import { Property } from '@mikro-orm/core';

import { MongoEntity } from './mongo.entity';

export abstract class MongoObjectEntity extends MongoEntity {
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
