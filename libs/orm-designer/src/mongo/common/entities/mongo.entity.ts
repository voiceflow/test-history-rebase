import { PrimaryKey, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

import type { BaseEntity } from '@/common';
import type { ToJSON } from '@/types';

export abstract class MongoEntity implements BaseEntity {
  @PrimaryKey()
  _id: ObjectId;

  @SerializedPrimaryKey()
  id: string;

  constructor({ _id }: { _id?: string }) {
    this._id = new ObjectId(_id);
    this.id = this._id.toHexString();
  }

  abstract toJSON(): ToJSON<MongoEntity>;

  protected stripUndefinedFields() {
    for (const key in this) {
      if (this[key] === undefined) {
        delete this[key];
      }
    }
  }
}
