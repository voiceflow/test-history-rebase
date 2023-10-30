import type { EntityDTO } from '@mikro-orm/core';
import { PrimaryKey, SerializedPrimaryKey, wrap } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

import type { BaseEntity } from '@/common';
import type { ToJSON } from '@/types';

export abstract class MongoEntity implements BaseEntity {
  static wrap<T extends MongoEntity>(entity: T, ...args: any[]) {
    return {
      ...wrap(entity).toObject(...args),
      _id: entity._id.toJSON(),
    };
  }

  @PrimaryKey()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id: string;

  constructor({ _id }: { _id?: string }) {
    this._id = new ObjectId(_id);
    this.id = this._id.toHexString();
  }

  wrap<Entity extends MongoEntity>(): EntityDTO<Entity> {
    return MongoEntity.wrap(this) as EntityDTO<Entity>;
  }

  abstract toJSON(): ToJSON<MongoEntity>;
}
