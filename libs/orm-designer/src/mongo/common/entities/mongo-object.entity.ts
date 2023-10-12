import { Property } from '@mikro-orm/core';

import { MongoCreatableEntity } from './mongo-creatable.entity';

export abstract class MongoObjectEntity extends MongoCreatableEntity {
  @Property({ onCreate: () => Date.now(), onUpdate: () => Date.now() })
  updatedAt!: number;
}
