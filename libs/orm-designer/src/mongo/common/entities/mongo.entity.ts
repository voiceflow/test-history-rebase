import { PrimaryKey, Property, SerializedPrimaryKey, wrap } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

import type { BaseEntity } from '@/common';

export abstract class MongoEntity implements BaseEntity {
  @Property()
  _version!: number;

  @PrimaryKey({ onCreate: () => new ObjectId() })
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  constructor({ _version }: Pick<MongoEntity, '_version'>) {
    this._version = _version;
  }

  toJSON(...args: any[]) {
    return wrap(this).toObject(...args);
  }
}
